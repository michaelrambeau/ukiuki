resource = angular.module('resourceMockup', [])


resource.factory 'ResourceGallery', () ->
	$("#spinner").removeClass('active')
	galleries = []
	count = 20
	for i in [1..count]
		gallery =
			category: if i < 6 then "DIGITAL" else "CARTOONS"
			featured: true
			key: "batman"
			title: "Batman"
			image:
				url: "/images/gallery.gif"
		galleries.push gallery


	categories = [
		value: "DIGITAL"
		label: 'Digital'
	,
		value: "CARTOONS"
		label: 'Cartoons'
	]

	stats = [
		_id: "DIGITAL"
		total: 5
	,
		_id: "CARTOONS"
		total: 15
	]


	api =
		getFeatured: (cb) ->
			result =
				success: true
				galleries: galleries
				categories: categories
			cb result
		getStatsByCategory: (cb) ->
			result =
				success: true
				categories: stats
			cb result
	api

resource.factory 'ResourceUser', ->
	users = [
		"_id": "53dc4864d8b69354015c6171"
		"email": "mikeairweb@gmail.com"
		"featured": true
		"isAdmin": true
		"name":
			"last": "User",
			"first": "Admin"
		"username": "admin"
	]
	api =
		getFeatured: (cb) ->
			result =
				success: true
				users: users
			cb result
		getCurrentUserData: (cb) ->
			result =
				status: 'OK'
				user: null
			cb result
	api
