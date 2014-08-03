var async = require('async'),
	keystone = require('keystone');

exports = module.exports = function (req, res) {
	var Gallery = keystone.list("Gallery");
	Gallery.model.aggregate([
	{
		"$group":{
			"_id": "$category",
			"total": {$sum: 1}
		}
	}
	])
	.exec(function (err, records) {
		return res.json({
			success: true,
			categories: records
		});
	});
	
};