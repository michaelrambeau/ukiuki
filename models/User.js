var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
	map: { name: 'username' }
});

User.add({
	username: { type: String, initial: true, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	featured: {type: Boolean}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.schema.methods.getGalleries = function(cb) {
	var Gallery = keystone.list("Gallery");
	Gallery.model.find({author: this._id})
		.exec(function(err, records) {
			cb(err, records)
		});
};


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'author' });
User.relationship({ ref: 'Gallery', path: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'username, email, isAdmin, featured';
User.register();
