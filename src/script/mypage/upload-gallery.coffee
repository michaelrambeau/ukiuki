app.controller "GalleryUploadController", ($scope, $upload, $http, $state, Categories) ->
	console.log "GalleryUploadController", $scope.currentUser

	#upload status:
	# - 0 = initial status (before a picture is selected)
	# - 1 = upload in progress
	# - 2 = upload complete
	$scope.status = 0

	#upload percentage
	$scope.progress = 0

	config =
		cloud_name: 'ukiukidev'
		upload_preset: 'se4iauwt'


	Categories.getAll (data) ->
		$scope.categories = data

	$.cloudinary.config 'cloud_name', config.cloud_name
	$.cloudinary.config 'upload_preset', config.upload_preset

	$scope.onFileSelect = ($files) ->
		for file in $files
			tags = [
				$scope.currentUser.username
				$scope.category
				'NEW'
			]
			$scope.upload = $upload.upload
				showLoading: false
				url: 'https://api.cloudinary.com/v1_1/' + config.cloud_name + '/upload'
				data:
					upload_preset: config.upload_preset
					tags: tags.join(',')
				file: file

			$scope.upload.progress (evt) ->
				$scope.status = if evt.loaded is evt.total then 2 else 1
				p = parseInt(100.0 * evt.loaded / evt.total)
				$scope.progress = p
				console.log('percent: ' + p)

			$scope.upload.success (data, status, headers, config) ->
				if data.error
					$scope.status = 3
					$scope.error = data.error
				else
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



