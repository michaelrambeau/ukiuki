app.controller 'MyGalleriesController', ($scope, $http) ->

	console.log "MyGalleries controller"

	$scope.getGalleries = ->
		console.log "Loading user's galleries..."
		$http.get("api/user-galleries/" + $scope.user._id).success (data) ->
			$scope.galleries = data.galleries
			console.info $scope.galleries.length, "User galleries loaded"

	$scope.$on 'authenticated', ->
		$scope.getGalleries()

	if $scope.user then $scope.getGalleries()
