'use strict';

var fs = require('fs');
var jwt = require('jsonwebtoken');

var config = require('./config');

// Load the certificate
var cert = fs.readFileSync(config.security.cert);

// Get the user's authentication token
module.exports.getAuthToken = function (user) {
	let payload = {
		username: user.username,
		email: user.email
	};

	return new Promise(function (resolve, reject) {
		// Sign the payload asynchrously
		jwt.sign(payload, cert, config.security.options, function (error, token) {
			if (error) {
				reject(error);
			}
			else {
				resolve(token);
			}
		});
	});
}

// Check an user's authentication token
module.exports.checkAuthToken = function(token) {
	return new Promise(function (resolve, reject) {
		jwt.verify(token, cert, function (error, payload) {
			if (error) {
				reject(error);
			}
			else {
				resolve(payload);
			}
		});
	});
}
