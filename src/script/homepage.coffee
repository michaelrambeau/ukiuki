adjustHeightOLD = ->
	h = $("img.gallery:first").height()
	$(".gallery.info").height h
	return
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



app.controller "BrowseController", ($scope, $http) ->
	
	#adjustHeight();
	
	#return true;
	
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
	$(".navbar-toggle").click ->
		$sidebar.sidebar "toggle"
		return

	if true
		$http.get("api/featuredItems").success (data) ->
			$scope.galleries = data.galleries
			$scope.categories = data.categories
			$scope.loading = false
			console.info $scope.galleries.length, "items loaded"
			getStatsByCategory()
			$scope.user = data.user
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

	$scope.getThumbnailUrl = (gallery) ->
		url = gallery.image.url
		re = /\/v\d*\//
		url.replace re, "/t_ukiuki2/"

	$scope.categories = []
	$scope.search =
		category: "*"
		text: ""

	getStatsByCategory = ->
		$http.get("api/stats").success (data) ->
			data.categories.forEach (cat) ->
				found = findCategory(cat._id)
				found.total = cat.total	if found
				return

			return

		return

	$scope.setCategory = (id) ->
		$scope.search.category = id
		return

	return
