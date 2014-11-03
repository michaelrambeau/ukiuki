app.directive 'tabs', () ->
	restrict: 'E'
	scope:
		user: '='
	transclude: true
	template: '<div ng-transclude></div>'
	replace: true
	controller: ($scope) ->
		console.info "tabs ctrl", $scope.user
		this.user = $scope.user
	link: (scope, element, attrs, tabsCtrl) ->
		console.info "user fom link=", scope.user

app.directive 'tab', ->
	restrict: 'E'
	require: '^tabs',
	transclude: true
	replace: true
	scope:
		state: '@'
		user: '='
	template: '<a href="" ui-sref="{{state}}" ng-class="{selected: currentState.includes(state)}" ng-transclude></a>'
	controller: ($scope, $rootScope) ->
		#$scope.currentState =  $rootScope.$state.current
		$rootScope.$watch '$state.current.name', ->
			console.log $rootScope.$state.current.name
			$scope.currentState = $rootScope.$state
		return
	link: (scope, element, attrs, tabsCtrl) ->
		console.info "user=", tabsCtrl.user
		#scope.user = tabsCtrl.user
