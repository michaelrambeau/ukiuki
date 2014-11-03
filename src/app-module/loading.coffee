#Display a loading .gif during all ajax requests done with $http service.
#except if a configLoading option is set to false
app.config ($httpProvider) ->
	$httpProvider.interceptors.push('myHttpInterceptor')
	return true

#register the interceptor as a service
app.factory 'myHttpInterceptor', ($q) ->
	n = 0
	hideLoading = () ->
		n--
		if n > 0
			console.log "A previous request is still pending..."
		else
			$("#spinner").removeClass('active')
	showLoading = () ->
		n++
		$("#spinner").addClass('active')
	api =
		request: (config) ->
			#something on success
			showLoading() unless config.showLoading is false
			return config
		requestError: (rejection) ->
			#do something on error
			return $q.reject(rejection)
		response: (response) ->
			#do something on success
			hideLoading()
			return response
		responseError: (rejection) ->
			#something on error
			hideLoading()
			return $q.reject(rejection)
	api
