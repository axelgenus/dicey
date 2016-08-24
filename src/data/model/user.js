'use strict';

var mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	roles: { type: [String], default: ['user'] },
	createdOn: { type: Date, default: Date.now },
	active: { type: Boolean, default: false }
});

/*
userSchema.statics.create = function ({ username, password, email }) {
	let user = new User({
		username: username,
		password: password, // TODO: secure the password
		email: email
	});

	return user.save();
}
*/

userSchema.methods.update = function ({ password, email }) {
	this.password = password; // TODO: secure the password
	this.email = email;

	return this.save();
}

userSchema.methods.enable = function () {
	this.active = true;

	return this.save();
}

userSchema.methods.disable = function () {
	this.active = false;

	return this.save();
}

module.exports.Model = mongoose.model("user", userSchema);
