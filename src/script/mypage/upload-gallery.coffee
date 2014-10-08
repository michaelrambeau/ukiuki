app.controller "MyPageController", ($scope, $upload, $http, $state, Categories) ->
	console.log "MyPageController", $scope.user
	config =
		cloud_name: 'ukiukidev'
		upload_preset: 'se4iauwt'
	options =
		title:  'Test mike ' + new Date()

		#upload status: 0, 1 or 2
		status:  0

		progress: 0

	#$scope[key] = value for key, value of options

	Categories.getAll (data) ->
		$scope.categories = data

	$.cloudinary.config 'cloud_name', config.cloud_name
	$.cloudinary.config 'upload_preset', config.upload_preset

	$scope.onFileSelect = ($files) ->
		for file in $files
			$scope.upload = $upload.upload
				url: 'https://api.cloudinary.com/v1_1/' + config.cloud_name + '/upload'
				data:
					upload_preset: config.upload_preset
					tags: $scope.user.username + "," + $scope.category
				file: file

			$scope.upload.progress (evt) ->
				$scope.status = if evt.loaded is evt.total then 2 else 1
				p = parseInt(100.0 * evt.loaded / evt.total)
				$scope.progress = p
				console.log('percent: ' + p)

			$scope.upload.success (data, status, headers, config) ->
				$scope.status = 2
				$scope.gallery = data

	$scope.isFormValid = ->
		if $scope.uploadForm.$valid and $scope.status is 2 then true else false

	$scope.save = () ->
		console.info "Saving the gallery..."
		url = "/api/upload-gallery"
		data =
			title: $scope.title
			category: $scope.category
			image: JSON.stringify $scope.gallery
		$http.post(url, data)
			.success (result) ->
				console.info "The gallery has been uploaded!"
				$scope.$emit "upload", data
				$state.go("mypage.galleries")

	$scope.test = ->
		console.info $scope.isFormValid()



