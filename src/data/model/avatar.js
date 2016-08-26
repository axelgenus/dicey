'use strict';

var mongoose = require('mongoose');

var avatarSchema = new mongoose.Schema({
	name: String,
	picture: String,
	sheet: mongoose.Schema.Types.Mixed,
	createdAt: Date,
	updatedAt: Date
}, {
	timestamps:	{
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

avatarSchema.methods.update = function ({ name, picture, sheet }) {
	if (name) this.name = name;
	if (picture) this.picture = picture;
	if (sheet) this.sheet = sheet;

	return this.parent.save();
}

module.exports = mongoose.model("avatar", avatarSchema);
