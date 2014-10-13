$sidebar = undefined
$searchbar = undefined
$loginBlock = undefined
$loginCloseBar = undefined

$(document).ready ->
	$searchbar = $(".uki-navbar")
	$loginBlock = $("#login-block")
	$loginCloseBar = $(".leftbar,.topbar")
	$loginBlock.on "show.bs.collapse", ->
		$searchbar.hide()
		return

	$loginBlock.on "shown.bs.collapse", ->
		$loginBlock.find("input:first").focus()
		return

	$loginBlock.on "hide.bs.collapse", ->
		$searchbar.show()
		return

	$loginCloseBar.click ->
		$loginBlock.collapse "hide"
		return

app.controller "MainController", ($scope, $http, $state, User) ->
	console.log "Main controller"
	$scope.currentUser = null

	$scope.getUserData = ->
		$http.get("/api/user-data").success (data) ->
			console.info "Connected user", data.user
			if data.user?
				$scope.currentUser = data.user
				$scope.$broadcast 'authenticated'

	#get data about the current user
	$scope.getUserData()

	$scope.isLoggedin = ->
		$scope.currentUser?

	$scope.signout = ->
		$http.post("/api/signout").success((data) ->
			$scope.currentUser = null
			console.log "Disconnected."
			$state.go("browse")
			return
		).error (data) ->
			console.log "Sign out error!"
			return

		return

	#Listen for events from child scopes and broadcast to other child scopes
	events = [
		"signup-submission"
		 "signin-submission"
		"upload"
	]

	for event in events
		$scope.$on event, (ev, data) ->
			# PREVENT INFINITE LOOP ON BROADCAST
			return	if ev.targetScope is $scope
			console.log "MainController on event", ev.name
			$scope.$broadcast ev.name, data
			return

	$scope.$on "login", (ev, data) ->
		console.info data.user, 'is logged-in.'
		$scope.currentUser = data.user
		$loginBlock.collapse "hide"
		$state.go 'mypage.galleries'

	User.getFeatured (users) ->
		$scope.featuredUsers = users
