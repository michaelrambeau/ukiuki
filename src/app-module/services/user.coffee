app.factory "User", (ResourceUser) ->

	api =
		getFeatured: (cb) ->
			ResourceUser.getFeatured (data) ->
				cb data.users
	api
