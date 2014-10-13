app.controller 'MyGalleriesController', ($scope, $http) ->

	console.log "MyGalleries controller"

	$scope.getGalleries = ->
		console.log "Loading user's galleries..."
		$http.get("api/user-galleries/" + $scope.currentUser._id).success (data) ->
			$scope.galleries = data.galleries
			console.info $scope.galleries.length, "User galleries loaded"

	#when the user reloads "My gallery" page, listen to the "authenticated" event that tells us who is connected,
	#because we need to know whose galleries to load!
	$scope.$on 'authenticated', ->
		$scope.getGalleries()

	#After a gallery has been uploaded, refresh the list
	$scope.$on 'upload', ->
		$scope.getGalleries()

	#when the controller is called for the 1st time, load user's galleries
	#if the user is defined (that is to say if the user comess from the login form)
	if $scope.isLoggedin() then $scope.getGalleries()
