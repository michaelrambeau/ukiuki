window.app = angular.module("app", [
	"resource"
	"ui.router"
	"ct.ui.router.extras"
	"angularFileUpload"
	"cloudinary"
])
app.run [
	"$rootScope"
	"$state"
	"$stateParams"
	($rootScope, $state, $stateParams) ->

		# It's very handy to add references to $state and $stateParams to the $rootScope
		# so that you can access them from any scope within your applications.For example,
		# <li ui-sref-active="active }"> will set the <li> // to active whenever
		# 'contacts.list' or one of its decendents is active.
		$rootScope.$state = $state
		$rootScope.$stateParams = $stateParams
]
app.config ($stateProvider, $urlRouterProvider) ->

	# For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise "/browse"

	states =
		"browse":
			url: "/browse"
			views:
				browse:
					template: $("#browse-items-block").html()
					controller: "BrowseController"
			deepStateRedirect: true
			sticky: true
		"whatisukiuki":
			url: "/whatisukiuki"
			views:
				whatisukiuki:
					templateUrl: "html/whatisukiuki.html"
			deepStateRedirect: true
			sticky: true


		"user":
			url: "/user/:username"
			views:
				mypage:
					templateUrl: "html/user/index.html"
					controller: 'UserController'
			deepStateRedirect: false
			sticky: false
		"user.galleries":
			url: "/galleries"
			templateUrl: "html/user/user-galleries.html"
			#controller: 'MyGalleriesController'
		"user.home":
			url: "/home"
			templateUrl: "html/user/home.html"
		"user.blog":
			url: "/blog"
			templateUrl: "html/user/blog.html"
		"user.galleries.upload":
			url: "/upload"
			templateUrl: "html/user/upload-gallery.html"
			controller: 'MyPageController'

		"mypage":
			url: "/mypage"
			views:
				mypage:
					templateUrl: "html/mypage/index.html"
			deepStateRedirect: true
			sticky: true
		"mypage.galleries":
			url: "/galleries"
			templateUrl: "html/mypage/user-galleries.html"
			controller: 'MyGalleriesController'
		"mypage.home":
			url: "/home"
			templateUrl: "html/mypage/home.html"
		"mypage.blog":
			url: "/blog"
			templateUrl: "html/mypage/blog.html"
		"mypage.galleries.upload":
			url: "/upload"
			templateUrl: "html/mypage/upload-gallery.html"
			controller: 'GalleryUploadController'

	for key,options of states
		$stateProvider.state key, options
