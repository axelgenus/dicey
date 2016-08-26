'use strict';

var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');

var config = require('./config');
var error = require('./error');
var HttpError = require('./httperror');
var User = require('./data/model/user');

// Load the keys and set the encryption algorithm
var algorithm = config.security.algorithm;
var privatekey = fs.readFileSync(path.join(__dirname, config.security.privatekey));
var publickey = fs.readFileSync(path.join(__dirname, config.security.publickey));

// Get the user's authentication token
module.exports.getAuthToken = function (user) {
	let payload = {
		userID: user._id
	}

	let options = {
		algorithm: algorithm,
		expiresIn: '1d',
		issuer: 'dicey'
	}

	// Sign the payload asynchrously
	return new Promise(function (resolve, reject) {
		jwt.sign(payload, privatekey, options, function (error, token) {
			if (error) {
				reject(error);
			}
			else {
				resolve(token);
			}
		});
	});
}

// Attach the authentication data to the request
module.exports.authenticate = function (request, response, next) {
	let authorization = request.get('Authorization');

	if (authorization === undefined) {
		next();
	}
	else {
		let [, token] = authorization.match(/^Bearer (.+)$/);

		// Verify the token
		jwt.verify(token, publickey, { algorithms: [algorithm] }, function (error, payload) {
			if (error) {
				next(error);
			}
			else {
				User.findById(payload.userID).then(
					(user) => {
						request.auth = user;
						next();
					},
					(error) => { next(error); }
				);
			}
		});
	}
}

// Handle access to users' area 
module.exports.requireUser = function (request, response, next) {
	if (request.auth && request.auth.roles.includes('user')) {
		next();
	}
	else {
		error.restrictedArea(request, response, next);
	}
}

// Handle access to admin-only area
module.exports.requireAdmin = function (request, response, next) {
	if (request.auth && request.auth.roles.includes('admin')) {
		next();
	}
	else {
		error.restrictedArea(request, response, next);
	}
}
