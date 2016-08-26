'use strict';

var config = require('./config.json');

var error = require('./error');
var security = require('./security');
var database = require('./data/database');

var path = require('path');
var express = require('express');

var auth = require('./routes/auth');
var api = require('./routes/api');
var web = require('./routes/web');

// Open the database connection
database.open(config.datasource);

// Initialize ExpressJS
const app = express();

// Set the rendering engine to pug (JADE)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Static content
app.use(express.static('public'));

// Set routes
app.use('/auth', auth.router);
app.use('/api.v1', security.authenticate, api.router);
app.use(web.router);

// Set the catch-all and the error handler
app.use(error.notFound);
app.use(error.handler);

// Lauch Express engine
app.listen(config.port, 
	() => { console.info('Dicey is running on port ' + config.port); }
);
