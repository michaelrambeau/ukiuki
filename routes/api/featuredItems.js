var async = require('async'),
	keystone = require('keystone');

exports = module.exports = function (req, res) {
	var Gallery = keystone.list("Gallery");
	Gallery.model.find()
		.exec(function (err, records) {
			return res.json({
				success: true,
				galleries: records,
				categories: Gallery.categories,
				user: req.user,
				version: 'O.1'
			
			});
		});
	
};