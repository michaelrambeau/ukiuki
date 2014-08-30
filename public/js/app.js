var app = angular.module("app", ['ui.router', 'ct.ui.router.extras']);

app.run(
	['$rootScope', '$state', '$stateParams',
	function ($rootScope,   $state,   $stateParams) {

		// It's very handy to add references to $state and $stateParams to the $rootScope
		// so that you can access them from any scope within your applications.For example,
		// <li ui-sref-active="active }"> will set the <li> // to active whenever
		// 'contacts.list' or one of its decendents is active.
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
}]);

app.config(function($stateProvider, $urlRouterProvider) {
  
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/browse");
  
  // Now set up the states
  $stateProvider
    .state('browse', {
      url: "/browse",
      template: $("#browse-items-block").html(),
			controller: 'BrowseController',
			deepStateRedirect: true
    })
		.state('items.list', {
      url: "/:categoryId/:index",
      templateUrl: "/html/etext-item.html"
    })
    .state('whatisukiuki', {
      url: "/whatisukiuki",
      templateUrl: "html/whatisukiuki.html"
    })
});