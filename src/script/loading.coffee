app.config ($httpProvider) ->
  $httpProvider.responseInterceptors.push('myHttpInterceptor')

  spinnerFunction = (data, headersGetter) ->
    $("#spinner").addClass('active')
    return data

  $httpProvider.defaults.transformRequest.push(spinnerFunction)

app.factory "myHttpInterceptor", ($q, $window) ->
	hideLoading = () ->
		$("#spinner").removeClass('active')
	cb1 = (response) ->
		hideLoading()
		response
	cb2 = (response) ->
		hideLoading()
		$q.reject response
	api = (promise) ->
		promise.then cb1, cb2
	api
