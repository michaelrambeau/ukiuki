var keystone = require('keystone');

module.exports.get = function (req, res) {
	var Gallery = keystone.list("Gallery");
	res.apiResponse({
		"status": "OK",
		"categories": Gallery.categories
	});
};
