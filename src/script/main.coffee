app.controller "MainController", ($scope, $http) ->
	console.log "Main controller"
	$scope.user = null
	$scope.signout = ->
		$http.post("/api/signout").success((data) ->
			$scope.user = null
			console.log "Disconnected."
			return
		).error (data) ->
			console.log "Sign out error!"
			return

		return

	$scope.$on "signup-submission", (ev, data) ->
		
		# PREVENT INFINITE LOOP ON BROADCAST
		return	if ev.targetScope is $scope
		console.log "on event"
		$scope.$broadcast "signup-submission", data
		return

	$scope.$on "signin-submission", (ev, data) ->
		console.log "on event"
		
		# PREVENT INFINITE LOOP ON BROADCAST
		return	if ev.targetScope is $scope
		$scope.$broadcast "signin-submission", data
		return

	return