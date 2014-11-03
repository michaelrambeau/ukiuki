adjustHeightOLD = ->
	h = $("img.gallery:first").height()
	$(".gallery.info").height h
	return


app.controller "BrowseController", ($scope, ResourceGallery) ->

	#Example of URL "http://res.cloudinary.com/michaelrambeau/image/upload/v1406960129/bfwg81wgizopp1wumizj.jpg"
	#use a "named transformation" that creates the thumbnail (300px wide)
	findCategory = (code) ->
		found = null
		$scope.categories.forEach (cat) ->
			found = cat	if code is cat.value
			return

		found
	console.log "BrowseController"
	$scope.galleries = []
	i = 0

	while i < 10
		$scope.galleries.push title: i
		i++
	console.log $scope.galleries.length
	$scope.loading = true
	$sidebar = $(".ui.sidebar:visible")
	$sidebar.sidebar debug: true
	$(".filter-bar-toggle").click ->
		$sidebar.sidebar "toggle"
		return

	$scope.searchFilter = (item) ->
		titleFilter = new RegExp($scope.search.text, "i").test(item.title)
		descriptionFilter = RegExp($scope.search.text, "i").test(item.description)
		categoryFilter = ($scope.search.category is "*") or (item.category is $scope.search.category)
		categoryFilter and (titleFilter or descriptionFilter)

	$scope.formatDate = (source) ->
		dateOnly = source.split(" ")[0]
		ymd = dateOnly.split("-")
		moment(new Date(ymd[0], ymd[1], ymd[2])).fromNow()

	$scope.categories = []
	$scope.search =
		category: "*"
		text: ""

	getStatsByCategory = ->
		ResourceGallery.getStatsByCategory (data) ->
			data.categories.forEach (cat) ->
				found = findCategory(cat._id)
				found.total = cat.total	if found
				return

			return

		return

	$scope.setCategory = (id) ->
		$scope.search.category = id
		return


	ResourceGallery.getFeatured (data) ->
		$scope.galleries = data.galleries
		$scope.categories = data.categories
		console.info $scope.galleries.length, "items loaded"
		getStatsByCategory()
		$scope.loading = false
		return


	return
