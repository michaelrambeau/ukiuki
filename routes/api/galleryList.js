var async = require('async'),
	keystone = require('keystone');


//Return galleries displayed in the top page
exports = module.exports.getFeaturedGalleries = function (req, res) {

	var Gallery = keystone.list("Gallery");
	var search = {
		featured: true
	};
	Gallery.model.find(search)
		.exec(function (err, records) {
			return res.json({
				success: true,
				galleries: records,
				categories: Gallery.categories,
				version: 'O.1'

			});
		});

};

//Return galleries by user
exports = module.exports.getUserGalleries = function (req, res) {

	var userId = req.params.userId;
	var Gallery = keystone.list("Gallery");
	var search = {
		author: userId
	};
	Gallery.model.find(search)
		.exec(function (err, records) {
			return res.json({
				success: true,
				galleries: records,
				categories: Gallery.categories,
				version: 'O.1'

			});
		});
};
