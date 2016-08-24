'use strict';

var config = require('./config.json');

var error = require('./error');
var database = require('./data/database');

var path = require('path');
var express = require('express');

var auth = require('./routes/auth');
var api = require('./routes/api');
var web = require('./routes/web');

database.open(config.datasource).then(
	() => { console.info('Connected to the database', config.datasource); },
	(error) => { console.error('Error attempting connection to the database'); process.exit(1); }
);

const app = express();

// Set the rendering engine to pug (JADE)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Static content
app.use(express.static('public'));

// Set routes
app.use('/auth', auth.router);
app.use('/api.v1', api.router);
app.use(web.router);

// Set error handlers
app.use(error.notFound);
app.use(error.handler);

// Lauch Express engine
app.listen(config.port, 
	() => { console.info('Dicey is running on port ' + config.port); }
);
