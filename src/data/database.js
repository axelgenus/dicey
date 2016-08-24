'use strict';

var mongoose = require('mongoose');

module.exports.open = function (database) {
	mongoose.Promise = global.Promise;

	// Close connection if already exists
	mongoose.connection.close();

	return new Promise(function (resolve, reject) {
		mongoose.connect(database);

		let db = mongoose.connection;
		db.on('error', (error) => { reject(error); });
		db.once('open', () => { resolve(); });
	});
}

module.exports.close = function () {
	mongoose.connection.close();
}