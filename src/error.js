'use strict';

var HttpError = require('./httperror');

module.exports.handler = function (error, request, response, next) {
	console.error(error);

	response.status(error.statusCode || 500).json({
		error: {
			message: error.message
		}
	});
}

module.exports.restrictedArea = function (request, response, next) {
	next(new HttpError(403, "Restricted area"));
}

module.exports.notFound = function (request, response, next) {
	next(new HttpError(404, "Not found"));
}
