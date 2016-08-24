'use strict';

var mongoose = require('mongoose');

var Avatar = require('./avatar');

let campaignSchema = new mongoose.Schema({
	title: String,
	description: String,
	master: mongoose.Schema.Types.ObjectId, //userID
	avatars: [Avatar.schema],
	active: { type: Boolean, default: true }
});

/*
campaignSchema.statics.create = function ({ title, description, master }) {
	let campaign = new Campaign({
		title: title,
		description: description,
		master: master
	});

	return campaign.save();
}
*/

campaignSchema.methods.update = function ({ title, description }) {
	this.title = title;
	this.description = description;

	return this.save();
}

campaignSchema.methods.enable = function () {
	this.active = true;

	return this.save();
}

campaignSchema.methods.disable = function () {
	this.active = false;

	return this.save();
}

module.exports = mongoose.model("campaign", campaignSchema);
