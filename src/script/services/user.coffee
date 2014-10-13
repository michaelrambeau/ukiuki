app.factory "User", ($http) ->

	api =
		getFeatured: (cb) ->
			$http.get("api/user/featured").success (data) ->
				cb data.users
	api
