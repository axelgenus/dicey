'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
    required: true,
    trim: true
  },
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
    required: true,
    trim: true
	},
	roles: {
		type: [String],
		default: ['user']
	},
	active: {
		type: Boolean,
		default: false
	},
	createdAt: Date,
	updatedAt: Date
}, {
	timestamps:	{
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

// Check if the password has been modified and encrypt it
userSchema.pre('save', function (next) {
	let user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, function (error, salt) {
		    if (error) {
		      next(error);
		    }
		    else {
				  bcrypt.hash(user.password, salt, function(error, hash) {
				    if (error) {
				      next(error);
				    }
				    else {
			  	    user.password = hash;
			  	    next();
			  	  }
				  });
				}
		});
	}
	else {
		next();
	}
});

// Return a "safe" object representing the user account
userSchema.methods.toSafeObject = function () {
	let user = this.toObject({ versionKey: false });
	delete user.password;
	delete user.active;

	return user;
}

// Update the user's data
userSchema.methods.update = function ({ email, password }) {
	if (email) this.email = email;
	if (password) this.password = password;

	return this.save();
}

// Enable the user's account
userSchema.methods.enable = function () {
	this.active = true;

	return this.save();
}

// Disable the user's account
userSchema.methods.disable = function () {
	this.active = false;

	return this.save();
}

module.exports = mongoose.model('user', userSchema);
