'use strict';

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports.open = function (database) {
	// Close connection if already exists
	mongoose.connection.close();

	mongoose.connect(database);

	let db = mongoose.connection;

	mongoose.connection.on('error', (error) => {
		console.error('Database error:', error.message);
	});

	mongoose.connection.once('open', () => {
		console.info('Connected to the database', database);
	});
}

module.exports.close = function () {
	mongoose.connection.close();
}