app.factory "Categories", ($http) ->
	categories = {}

	api =
		getAll: (cb) ->
			$http.get("api/categories").success (data) ->
				categories = data.categories
				cb categories
	api
