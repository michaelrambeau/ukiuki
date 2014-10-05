var async = require('async'),
	keystone = require('keystone'),
	User = keystone.list("User"),
	_ = require('underscore');


//request launched by the main controller to get data about the current user.
module.exports.getUserData = function(req, res) {
	var user = null;
	if (req.user) {
		user = _.clone(req.user.toObject());
		delete user.password;
	}
	res.apiResponse({
		status: 'OK',
		user: user
	});
};

module.exports.signin = function (req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var onSuccess = function () {
		console.log("login OK!");
		res.json({
			status: "OK",
			session: req.session,
			user: req.user
		});
	};
	var onFail = function () {
		console.log("login failure!");
		res.apiError({
			key: 'FAILURE',
			err: 'Invalid login'
		});
	};	
	
	//use uki object instead of keystone.session
	uki.signin({ email: email, password: password }, req, res, onSuccess, onFail);
};


module.exports.signup = function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	
	//if (!username || !password || !email) throw new Error("username, email and password are required!")
	if (!username || !password || !email) return res.apiError('Username, email and password are required!');
	
	async.series([
		function (cb) {
			checkUsername(username, function (result) {
				console.log('username Ok ?', result);
				cb(null, result);
			});
		},
		function (cb) {
			checkEmail(email, function (result) {
				console.log('email OK ?', result);
				cb(null, result);
			});
		}
	]
	,
	function(err, results) {
		//res.json(results);
		if (results[0] == false) return res.apiError({
			key: 'USERNAME_TAKEN',
			err: 'Username already taken!'
		}); 
		if (results[1] == false) return res.apiError({
			key: 'EMAIL_TAKEN',
			err: 'Email already taken!'
		});
		
		createUser(username, email, password, function () {
			
			var onSuccess = function () {
				res.apiResponse({
					status: 'OK',
					session: req.session,
					user: req.user
				});	
			};
			var onFail = function () {
				res.apiError({
					key: "SIGNIN_ERROR"
				});
			};
			uki.signin({ email: email, password: password }, req, res, onSuccess, onFail)
		});
	}
	);
		
};

module.exports.signout = function (req, res) {
	
	keystone.session.signout(req, res, function () {
		res.apiResponse({
			status: "OK"
		});
	});
};

/*
Return true if the username is unique
*/
var checkUsername = function (username, cb) {
	console.log('check username', username);
	User.model.find({username: username})
		.exec(function (err, records) {
			if (err) throw error;
			cb(records.length == 0);
		});	
};
/*
Return true if the email address is unique
*/
var checkEmail = function (email, cb) {
	console.log('check email', email);
	User.model.find({email: email})
		.exec(function (err, records) {
			if (err) throw error;
			cb(records.length == 0);
		});	
};

var createUser = function (username, email, password, cb) {
	var userData = {
		username: username,
		email: email,
		password: password
	};
	var	newUser = new User.model(userData);
	console.log("Creating a new user", userData)
	newUser.save(function(err, saved) {
		if (err) throw error;
		if (saved) cb(null);
	});	
};

var uki = {};
uki.signin = function(lookup, req, res, onSuccess, onFail) {
	console.log("Uki sign in...", lookup);
	if (!lookup) {
		return onFail(new Error('session.signin requires a User ID or Object as the first argument'));
	}
	
	var User = keystone.list(keystone.get('user model'));
	
	var doSignin = function(user) {
		req.session.regenerate(function() {
			
			req.user = user;
			req.session.userId = user.id;
			
			// if the user has a password set, store a persistence cookie to resume sessions
			if (keystone.get('cookie signin') && user.password) {
				var userToken = user.id + ':' + keystone.session.hash(user.password);
				res.cookie('keystone.uid', userToken, { signed: true, httpOnly: true });
			}
			
			onSuccess(user);
			
		});
	};
	
	if ('string' === typeof lookup.email && 'string' === typeof lookup.password) {
		
		// match email address and password
		//User.model.findOne({ email: lookup.email }).exec(function(err, user) {
		User.model.findOne({$or: [{ email: lookup.email }, { username: lookup.email }]}).exec(function(err, user) {
			if (user) {
				console.log("User found", user);
				user._.password.compare(lookup.password, function(err, isMatch) {
					if (!err && isMatch) {
						doSignin(user);
					}
					else {
						onFail(err);
					}
				});
			}
			else {
				console.log("No user found", lookup.email)
				onFail(err);
			}
		});
		
	} else {
		
		lookup = '' + lookup;
		
		// match the userId, with optional password check
		var userId = (lookup.indexOf(':') > 0) ? lookup.substr(0, lookup.indexOf(':')) : lookup,
			passwordCheck = (lookup.indexOf(':') > 0) ? lookup.substr(lookup.indexOf(':') + 1) : false;
		
		User.model.findById(userId).exec(function(err, user) {
			if (user && (!passwordCheck || passwordCheck === keystone.session.hash(user.password))) {
				doSignin(user);
			} else {
				onFail(err);
			}
		});
	}

};
