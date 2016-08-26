'use strict';

var HttpError = require('../httperror');
var Security = require('../security');
var User = require('../data/model/user');

var router = require('express').Router();
var parseBody = require('body-parser').json;
var bcrypt = require('bcrypt');

// Sign-in a user
router.post('/login', parseBody(), function (request, response, next) {
	User.findOne({ $or: [{ username: request.body.identity }, { email: request.body.identity }] }).then(
		(user) => {
			if (!user) {
				next(new HttpError(401, "The user account not found"));
			}
			else if (!user.active) {
				next(new HttpError(403, "This user account has not been activated yet"));
			}
			else {
				bcrypt.compare(request.body.password, user.password, function (error, match) {
					if (error) {
						next(error);
					}
					else if (!match) {
						next(new HttpError(401, "Invalid credentials"));
					}
					else {
						Security.getAuthToken(user).then(
							(token) => {
								response.set('Content-Type', 'text/plain');
								response.send(token);
							},
							(error) => { next(error); }				
						);
					}
				});
			}
		},
		(error) => { next(error); }
	);
});

// Create a new user
router.post('/register', parseBody(), function (request, response, next) {
	User.create(request.body).then(
		(user) => {
			response.json(user.toSafeObject());
		},
		(error) => { next(error); }
	);
});

// Return the user's profile
router.get('/profile', Security.authenticate, Security.requireUser, function (request, response, next) {
	response.json(request.auth);
});

module.exports.router = router;