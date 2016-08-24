'use strict';

var User = require('../data/model/user');
var HttpError = require('../httperror.js');
var Security = require('../security.js');

var router = require('express').Router();
var parseBody = require('body-parser').json;

// Sign-in a user
router.post('/login', parseBody(), function (request, response, next) {
	let username = request.body.username;
	let password = request.body.password; // TODO: hash the password

	User.findOne({ username: username, password: password }).then(
		(user) => {
			Security.getAuthToken(user).then(
				(token) => { response.json(token); },
				(error) => { next(error); }
			);
		},
		(error) => { next(error); }
	);
});

// Create a new user
router.post('/register', parseBody(), function (request, response, next) {
	User.create(request.body).then(
		(user) => { response.json(user); },
		(error) => { next(error); }
	);
});

module.exports.router = router;