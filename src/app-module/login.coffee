app.controller "SignupController", ($scope, $http, $state) ->
	console.log "Signup controller"
	$scope.status = ""
	$scope.submit = ->
		$scope.submitted = true
		$scope.$emit "signup-submission"
		$scope.signupForm.$valid and $scope.signup()
		return

	$scope.signup = ->
		$scope.status = "LOADING"
		formData =
			email: $scope.email
			username: $scope.username
			password: $scope.password

		$http.post("/api/signup", formData).success((data) ->
			$scope.status = "SUCCESS"
			console.log data
			#Emit an event to the main scope to trigger navigation
			$scope.$emit 'login', data
			return
		).error (data) ->
			$scope.status = "ERROR"
			$scope.error = data.error.key
			return

		return

	$scope.$on "signin-submission", (data) ->
		$scope.status = ""
		return

	return

app.controller "SigninController", ($scope, $http) ->
	console.log "Signin controller"
	$scope.status = ""
	$scope.submitted = false
	$scope.submit = ->

		#submit event
		$scope.submitted = true
		$scope.$emit "signin-submission"
		$scope.signinForm.$valid and $scope.signin()
		return

	$scope.signin = ->

		#triggered when the form is valid
		$scope.status = "LOADING"
		formData =
			email: $scope.email #can be either an email address or a username
			password: $scope.password

		q = $http
			url: "/api/signin"
			method: "POST"
			data: formData
			showLoading: true
		q.success (data) ->
			$scope.status = "SUCCESS"
			console.log data
			#Emit an event to the main scope to trigger navigation
			$scope.$emit 'login', data
			return
		q.error (data) ->
			$scope.status = "ERROR"
			return

		return

	$scope.$on "signup-submission", (data) ->
		$scope.status = ""
		return

	return
