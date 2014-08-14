$(document).ready(function () {
	var $sidebar = $('.ui.sidebar');
	var $searchbar = $('.uki-navbar');
	var $loginBlock = $('#login-block');
	var $loginCloseBar = $('.leftbar')
	
	$sidebar.sidebar({
		debug: true
	});
	$(".navbar-toggle").click(function () {
		$sidebar.sidebar('toggle');
	});

	$loginBlock.on('show.bs.collapse', function () {
		//$searchbar.fadeOut();
		$searchbar.hide();
	});
	$loginBlock.on('hide.bs.collapse', function () {
		//$searchbar.fadeIn();
		$searchbar.show();
	});
	$loginCloseBar.click(function() {
		$loginBlock.collapse('hide')
	});
	
});

function adjustHeight(){
	h = $("img.gallery:first").height()
	$(".gallery.info").height(h);
}

var app = angular.module('app', []);
app.controller('MainController', function ($scope, $http) {
	$scope.categories = [];
	$scope.galleries = [];
	for(var i=0; i<12; i++) {
		$scope.galleries.push({title: i});
	}
	$scope.search = {
		category: "*",
		text: ""
	};
	$scope.loading = true;
	
	if (true) $http.get("api/featuredItems").success(function (data) {
		$scope.galleries = data.galleries;
		$scope.categories = data.categories;
		//adjustHeight();
		$scope.loading = false;
		console.info($scope.galleries.length,"items loaded");
		getStatsByCategory();
	});
	
	getStatsByCategory = function () {
		$http.get("api/stats").success(function (data) {
			data.categories.forEach(function (cat) {
				var found = findCategory(cat._id);
				if (found) found.total = cat.total;
			});
		});
	} 
	
	$scope.setCategory = function(id) {
		$scope.search.category = id;
	};
	
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
	
	
	function findCategory(code) {
		var found = null;
		$scope.categories.forEach(function (cat) {
			if (code == cat.value) {
				found = cat
			}
		});
		return found;
	}
});
		


