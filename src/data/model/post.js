'use strict';

var mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	location: String,
	date: String,
	campaign: mongoose.Schema.Types.ObjectId, //campaignID
	avatar: mongoose.Schema.Types.ObjectId, //avatarID
	recipients: [mongoose.Schema.Types.ObjectId], //avatarID's
	content: {
		ingame: String,
		outgame: String,
	}
});

/*
postSchema.statics.create = function ({ location, date, recipients, content: { ingame, outgame }}) {
	let post = new Post({
		location: location,
		date: date,
		recipients: recipients, // check
		content: {
			ingame: ingame,
			outgame: outgame
		}
	});

	return post.save();
}
*/

postSchema.methods.update = function ({ location, date, recipients, content: { ingame, outgame }}) {
	this.updatedOn = new Date();
	this.location = location;
	this.date = date;
	this.recipients = recipients; //check
	this.content.ingame = ingame;
	this.content.outgame = outgame;

	return this.save();
}

module.exports.Model = mongoose.model("post", postSchema);
