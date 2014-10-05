var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var categories = [
	{
		value: 'DIGITAL',
		label: "Digital"
	}, {
		value: 'TRADITIONAL',
		label: "Traditional"
	}, {
		value: 'ANIME',
		label: "Anime & Manga"
	}, {
		value: 'ARCHITECTURE',
		label: "Architecture"
	}, {
		value: 'ARTISAN',
		label: "Artisan"
	}, {
		value: 'CARTOONS',
		label: "Cartoons"
	}, {
		value: 'COMICS',
		label: "Comics"
	},  {
		value: 'COSPLAY',
		label: "Cosplay"
	}, {
		value: 'FANART',
		label: "Fan art"
	}, {
		value: 'FINEART',
		label: "Fine art"
	}, {
		value: 'LITERATURE',
		label: "Literature"
	}, {
		value: 'PHOTOGRAPHY',
		label: "Photography"
	}, {
		value: 'SCULPTURE',
		label: "Sculpture"
	}
];
		


var Gallery = new keystone.List('Gallery', {
	map: { name: 'title' },
	autokey: { from: 'title', path: 'key', unique: true }
});

Gallery.categories = categories;

Gallery.add({
	title: { type: String, required: true, initial: true },
	category: { type: Types.Select, options: categories, index: true },
	publishedDate: { type: Date, default: Date.now },
	image: { type: Types.CloudinaryImage },
	author: { type: Types.Relationship, ref: 'User', index: true },
	featured: { type: Boolean}
	//images: { type: Types.CloudinaryImages }
});

Gallery.defaultColumns = 'title, category, author|20%, publishedDate|20%';

Gallery.register();
