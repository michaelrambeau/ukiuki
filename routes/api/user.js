var async = require('async'),
	keystone = require('keystone');

var User = keystone.list("User");

/*
Return the list of "featured" users, to be displayed in the homepage
*/
module.exports.featured = function(req, res) {
	var search = {
		featured: true
	};
	User.model.find(search)
		.exec(function(err, records) {
			return res.json({
				success: true,
				users: records
			});
		});
};

/*
Return all data related to a given user
*/
module.exports.getUserData = function(req, res) {
	var username = req.params.username;
	console.log("Get user data", username);
	var search = {
		username: username
	};
	User.model.findOne(search)
		.exec(function(err, record) {
			if (err) throw err;
			if (!record) throw new Error("No user " + username);
			record.getGalleries(function(err, galleries) {
				if (err) throw err;
				res.apiResponse({
					user: record,
					galleries: galleries
				});
			});
		});
};
