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

app.controller "MainController", ($scope, $http, $state) ->
	console.log "Main controller"
	$scope.user = null

	$scope.getUserData = ->
		$http.get("/api/user-data").success (data) ->
			console.info "Connected user", data.user
			if data.user?
				$scope.user = data.user
				$scope.$broadcast 'authenticated'

	#get data about the current user
	$scope.getUserData()

	$scope.isLoggedin = ->
		$scope.user?

	$scope.signout = ->
		$http.post("/api/signout").success((data) ->
			$scope.user = null
			console.log "Disconnected."
			$state.go("browse")
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

	$scope.$on "login", (ev, data) ->
		console.info data.user, 'is logged-in.'
		$scope.user = data.user
		$loginBlock.collapse "hide"
		$state.go 'mypage.galleries'
