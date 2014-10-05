var cloudinary = require('../node_modules/keystone/node_modules/cloudinary');
require('dotenv').load();

//viewAll();
deleteAll();

function viewAll() {
	var cb = function(result) {
		if (result.error) {
			console.log(result);
			return;
		}
		var galleries = result.resources;
		if (!galleries) {
			console.log("no result!");
			return;
		}
		console.log(galleries.length);
		galleries.forEach(function(gallery) {
			console.log(gallery.public_id);
		});

	};
	var options = {
		max_results: 100,
		type: "upload",
		prefix: "galleries"
	};
	cloudinary.api.resources(cb, options);
}

function deleteAll() {
	cloudinary.api.delete_resources_by_prefix('galleries', function(result){
		console.log(result);
	});
}


//var url = "https://api.cloudinary.com/v1_1/demo/resources/images";
