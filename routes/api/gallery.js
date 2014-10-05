var async = require('async'),
	keystone = require('keystone'),
	Types = keystone.Field.Types,
	Gallery = keystone.list("Gallery");

module.exports.uploadGallery = function(req, res) {
	var imageData = JSON.parse(req.body.image);
	//var image = new Types.CloudinaryImage(imageData, '', {});
	var galleryData = {
		title: req.body.title,
		category: "SCULPTURE",
		publishedDate: new Date(),
		author: req.user,
		image: imageData
	};
	var gallery = new Gallery.model(galleryData);
	gallery.save(function(err, saved) {
		if (err) throw error;
		if (saved) console.log("New Gallery saved!");
		res.apiResponse({
			"status": "OK",
			"gallery": gallery
		});
	});

};
