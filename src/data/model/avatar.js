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

avatarSchema.methods.update = function (data) {
	this.name = data.name;
	this.picture = data.picture;
	this.sheet = data.sheet;

	return this.parent.save();
}

module.exports = mongoose.model("avatar", avatarSchema);
