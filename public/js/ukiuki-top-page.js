var $sidebar, $searchbar, $loginBlock, $loginCloseBar;

$(document).ready(function () {
	
	$searchbar = $('.uki-navbar');
	$loginBlock = $('#login-block');
	$loginCloseBar = $('.leftbar,.topbar');
	

	$loginBlock.on('show.bs.collapse', function () {
		$searchbar.hide();
	});
	$loginBlock.on('shown.bs.collapse', function () {
		$loginBlock.find("input:first").focus();
	});
	$loginBlock.on('hide.bs.collapse', function () {
		$searchbar.show();
	});
	$loginCloseBar.click(function () {
		$loginBlock.collapse('hide');
	});
	
});

function adjustHeight() {
	var h = $("img.gallery:first").height();
	$(".gallery.info").height(h);
}


app.controller('SignupController', function ($scope, $http) {
	console.log('Signup controller');
	$scope.status = '';
	
	$scope.submit = function() {
		$scope.submitted = true;
		$scope.$emit('signup-submission');
		$scope.signupForm.$valid && $scope.signup();
	};
	
	$scope.signup = function() {
		$scope.status = "LOADING";
		var formData = {
			email: $scope.email,
			username: $scope.username,
			password: $scope.password
		};
		$http.post("/api/signup", formData)
			.success(function (data) {
				$scope.status = 'SUCCESS';
				console.log(data);
			})
			.error(function (data) {
				$scope.status = 'ERROR';
				$scope.error = data.error.key;
			});
	};
	$scope.$on('signin-submission', function (data) {
		$scope.status = '';
	});
});

app.controller('SigninController', function ($scope, $http) {
	console.log('Signin controller');
	$scope.status = '';
	$scope.submitted = false;
	
	$scope.submit = function() {
		//submit event
		$scope.submitted = true;
		$scope.$emit('signin-submission');
		$scope.signinForm.$valid && $scope.signin();
	};
	
	$scope.signin = function() {
		//triggered when the form is valid
		$scope.status = "LOADING";
		var formData = {
			email: $scope.email,//can be either an email address or a username
			password: $scope.password
		};
		$http.post("/api/signin", formData)
			.success(function (data) {
				$scope.status = 'SUCCESS';
				console.log(data);
				//Update the global scope
				$scope.$parent.user = data.user;
				$loginBlock.collapse('hide');
			})
			.error(function (data) {
				$scope.status = 'ERROR';
			});
	};
	$scope.$on('signup-submission', function (data) {
		$scope.status = '';
	});	
	
});

app.controller('MainController', function ($scope, $http) {
	console.log("Main controller");
	$scope.user = null;
	
	$scope.signout = function () {
		$http.post("/api/signout")
			.success(function (data) {
				$scope.user = null;
				console.log("Disconnected.");
			})
			.error(function (data) {
				console.log("Sign out error!")
			});		
	}
	
	$scope.$on('signup-submission', function(ev, data) {
		// PREVENT INFINITE LOOP ON BROADCAST
		if(ev.targetScope == $scope) return;
		console.log('on event')
		$scope.$broadcast('signup-submission', data);
	});
	$scope.$on('signin-submission', function(ev, data) {
		console.log('on event')
		// PREVENT INFINITE LOOP ON BROADCAST
		if(ev.targetScope == $scope) return;
		$scope.$broadcast('signin-submission', data);
	});	
	
});


app.controller('BrowseController', function ($scope, $http) {
	console.log('BrowseController');
	$scope.galleries = [];
	for (var i=0; i<10; i++) {
		$scope.galleries.push({title: i});
	}
	console.log($scope.galleries.length);
	
	$scope.loading = true;
	
	$sidebar = $('.ui.sidebar:visible');
	$sidebar.sidebar({
		debug: true
	});
	$(".navbar-toggle").click(function () {
		$sidebar.sidebar('toggle');
	});
	
	
	if (true) $http.get("api/featuredItems").success(function (data) {
		$scope.galleries = data.galleries;
		$scope.categories = data.categories;
		//adjustHeight();
		$scope.loading = false;
		console.info($scope.galleries.length,"items loaded");
		getStatsByCategory();
		$scope.user = data.user;
	});
	
	$scope.searchFilter = function (item) {
		var titleFilter = new RegExp($scope.search.text, "i").test(item.title);
		var descriptionFilter = RegExp($scope.search.text, "i").test(item.description);
		var categoryFilter = ($scope.search.category == '*') || (item.category == $scope.search.category);
		
		return categoryFilter && (titleFilter || descriptionFilter);
		//return true;
	};
	
	$scope.formatDate = function (source) {
		var dateOnly = source.split(" ")[0];
		var ymd = dateOnly.split("-");
		return moment(new Date(ymd[0], ymd[1], ymd[2])).fromNow();
	};
	
	$scope.getThumbnailUrl = function (gallery) {
		var url = gallery.image.url;
		//Example of URL "http://res.cloudinary.com/michaelrambeau/image/upload/v1406960129/bfwg81wgizopp1wumizj.jpg"
		var re = /\/v\d*\//;
		return url.replace(re, "/t_ukiuki2/");//use a "named transformation" that creates the thumbnail (300px wide)
	};	
	
	$scope.categories = [];

	$scope.search = {
		category: "*",
		text: ""
	};

	
	getStatsByCategory = function () {
		$http.get("api/stats").success(function (data) {
			data.categories.forEach(function (cat) {
				var found = findCategory(cat._id);
				if (found) found.total = cat.total;
			});
		});
	} 
	
	function findCategory(code) {
		var found = null;
		$scope.categories.forEach(function (cat) {
			if (code == cat.value) {
				found = cat
			}
		});
		return found;
	}	
	
	$scope.setCategory = function(id) {
		$scope.search.category = id;
	};	
	
});	


