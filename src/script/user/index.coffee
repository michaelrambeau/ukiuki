app.controller 'UserController', ($scope, $http, $stateParams) ->
	username = $stateParams.username
	$http.get('/api/user-data/' + username).success (data) ->
		$scope.galleries = data.galleries
		$scope.user = data.user
