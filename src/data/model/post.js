'use strict';

var mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
	location: String,
	date: String,
	campaign: mongoose.Schema.Types.ObjectId, //campaignID
	avatar: mongoose.Schema.Types.ObjectId, //avatarID
	recipients: [mongoose.Schema.Types.ObjectId], //avatarID's
	content: {
		ingame: String,
		outgame: String,
	},
	createdAt: Date,
	updatedAt: Date
}, {
	timestamps:	{
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

postSchema.methods.update = function ({ location, date, recipients, content: { ingame, outgame }}) {
	if (location) this.location = location;
	if (date) this.date = date;
	if (recipients) this.recipients = recipients; //check
	if (ingame) this.content.ingame = ingame;
	if (outgame) this.content.outgame = outgame;

	return this.save();
}

module.exports = mongoose.model("post", postSchema);
