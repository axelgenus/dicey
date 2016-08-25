'use strict';

var router = require('express').Router();

// Home page
router.get('/', function (request, response) {
	response.render('home', {
		title: 'Home',
		lang: 'en',
		authenticated: false
	});
});

// Shows a login page
router.get('/login', function (request, response) {
	response.render('login');
});

// Shows a registration page
router.get('/register', function (request, response) {
	response.render('register');
});

// Shows a registration page
router.get('/profile', function (request, response) {
	response.render('profile');
});

// Shows a registration page
router.get('/about', function (request, response) {
	response.render('about');
});

// Shows the list of the campaigns
router.get('/campaigns', function (request, response) {
	response.render('campaigns');
});

// Shows the home page of a campaign
router.get('/campaigns/:campaignID', function (request, response) {
	// make use of request.query to get the display mode (normal/show or edit)

	response.render('campaign');

	// this method will render a one page mini-app for all the campaign-related needs:
		// - show the campaign data:
			// name
			// dungeon master
			// description
			// roleplaying system
		// - show the characters' list (PC's and NPC's)
		// - show a paged post list
		// - show a post popup with the following features:
			// show an existing post (display mode)
			// add a new post or edit an existing post (edit mode)
});

module.exports.router = router;