app.directive 'tabs', () ->
	restrict: 'E'
	scope: {}
	transclude: true
	template: '<div ng-transclude></div>'
	replace: true

app.directive 'tab', ->
	restrict: 'E'
	require: '^tabs',
	transclude: true
	replace: true
	scope:
		state: '@'
	template: '<a href="" ui-sref="{{state}}" ng-class="{selected: currentState.includes(state)}" ng-transclude></a>'
	controller: ($scope, $rootScope) ->
		#$scope.currentState =  $rootScope.$state.current
		$rootScope.$watch '$state.current.name', ->
			console.log $rootScope.$state.current.name
			$scope.currentState = $rootScope.$state
		return
