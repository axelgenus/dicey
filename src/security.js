'use strict';

var fs = require('fs');
var jwt = require('jsonwebtoken');

var config = require('./config');

// Load the keys and set the encryption algorithm
var algorithm = config.security.algorithm;
var privatekey = fs.readFileSync(config.security.privatekey);
var publickey = fs.readFileSync(config.security.publickey);

// Get the user's authentication token
module.exports.getAuthToken = function (user) {
	let payload = user.toSafeObject();

	// Sign the payload asynchrously
	return new Promise(function (resolve, reject) {
		jwt.sign(payload, privatekey, { algorithm: algorithm }, function (error, token) {
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
module.exports.authenticate = function(request, response, next) {
	let authorization = request.get('Authorization');

	if (authorization === undefined) {
		next();
	}
	else {
		let matches = authorization.match(/^Bearer (.+)$/);

		jwt.verify(matches[1], publickey, { algorithms: [algorithm] }, function (error, auth) {
			if (error) {
				next(error);
			}
			else {
				request.auth = auth;
				next();
			}
		});
	}
}

// Handle access to restricted area 
module.exports.requireAuthentication = function (request, response, next) {
	if (!request.auth) {
		next(new HttpError(403, "Restricted area"));
	}
	else {
		next();
	}
}
