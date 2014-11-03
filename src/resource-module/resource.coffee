resource = angular.module('resource', [])

resource.factory 'ResourceGallery', ($http) ->
	api =
		getFeatured: (cb) ->
			$http.get("api/featured-items").success (data) ->
				cb data
		getStatsByCategory: (cb) ->
			$http.get("api/stats").success (data)	->
				cb data
	api

resource.factory 'ResourceUser', ($http) ->
	api =
		getFeatured: (cb) ->
			$http.get("api/user/featured").success (data) ->
				cb data
		getCurrentUserData: (cb) ->
			$http.get("/api/user-data").success (data) ->
				cb data
	api
