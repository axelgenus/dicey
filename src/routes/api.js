'use strict';

var User = require('../data/model/user');
var Avatar = require('../data/model/avatar');
var Campaign = require('../data/model/campaign');
var Post = require('../data/model/post');

var HttpError = require('../httperror.js');

var router = require('express').Router();
var parseBody = require('body-parser').json;

// Attach the user model to the request if an userID parameter has been specified
router.param('userID', function (request, response, next, userID) {
	User.findById(userID, { password: false }).then(
		(user) => {
			if (user) {
				request.user = user;
				return next();
			}

			var error = new HttpError(404, "User not found");
			return next(error);
		},
		(error) => { return next(error); }
	);
});

// Attach the campaign model to the request if an userID parameter has been specified
router.param('campaignID', function (request, response, next, campaignID) {
	Campaign.findById(campaignID).then(
		(campaign) => {
			if (campaign) {
				request.campaign = campaign;
				return next();
			}

			var error = new HttpError(404, "Campaign not found");
			return next(error);
		},
		(error) => { return next(error); }
	);
});

// Attach the avatar model to the request if an avatarID parameter has been specified
router.param('avatarID', function (request, response, next, avatarID) {
	let avatar = request.campaign.avatars.id(avatarID);

	if (avatar) {
		request.avatar = avatar;
		return next();
	}

	var error = new HttpError(404, "Avatar not found");
	return next(error);
});

// Attach the post model to the request if a postID parameter has been specified
router.param('postID', function (request, response, next, postID) {
	Campaign.findById(postID).then(
		(post) => {
			if (post) {
				request.post = post;
				return next();
			}

			var error = new HttpError(404, "Post not found");
			return next(error);
		},
		(error) => { return next(error); }
	);
});

// Get users' list (with filter)
router.get('/users', function (request, response, next) {
	let limit = request.query.limit || 25;
	let page = request.query.page || 1;

	var query = User.find().limit(limit).skip(limit * (page - 1));

	query.exec().then(
		(users) => { response.json(users); },
		(error) => { return next(error); }
	);
});

// Get an existing user
router.get('/users/:userID', function (request, response) {
	let user = request.user;

	response.json(user);
});

// Modify an existing user
router.put('/users/:userID', parseBody(), function (request, response, next) {
	let user = request.user;

	user.update(request.body).then(
		(user) => { response.json(user); },
		(error) => { return next(error); }
	);
});

// Get campaigns' list (with filter)
router.get('/campaigns', function (request, response, next) {
	let limit = request.query.limit || 5;
	let page = request.query.page || 1;

	let query = Campaign.find().limit(limit).skip(limit * (page - 1));

	query.exec().then(
		(campaigns) => { response.json(campaigns); },
		(error) => { return next(error); }
	);
});

// Get an existing campaign
router.get('/campaigns/:campaignID', function (request, response, next) {
	response.json(request.campaign);
});

// Create a new campaign
router.post('/campaigns', parseBody(), function (request, response, next) {
	Campaign.create(request.body).then(
		(result) => { response.status(201).json(result); },
		(error) => { return next(error); }
	);
});

// Modify an existing campaign
router.put('/campaigns/:campaignID', parseBody(), function (request, response, next) {
	let campaign = request.campaign;

	campaign.update(request.body).then(
		(result) => { response.json(camapign); },
		(error) => { return next(error); }
	);
});

// Disables an existing campaign
router.delete('/campaigns/:campaignID', function (request, response, next) {
	let campaign = request.campaign;

	campaign.disable().then(
		(result) => { response.json(camapign); },
		(error) => { return next(error); }
	);
});

// Get avatars' list (associated to a campaign)
router.get('/campaigns/:campaignID/avatars', function (request, response, next) {
	let campaign = request.campaign;

	response.json(campaign.avatars);
});

// Get an existing avatar
router.get('/campaigns/:campaignID/avatars/:avatarID', function (request, response, next) {
	let avatar = request.avatar;

	response.json(avatar);
});

// Add a new avatar
router.post('/campaigns/:campaignID/avatars', parseBody(), function (request, response, next) {
	let campaign = request.campaign;
	let avatar = new Avatar(request.body);

	campaign.avatars.push(avatar);
	campaign.save().then(
		(result) => { response.status(201).json(camapign); },
		(error) => { return next(error); }
	);
});

// Modify an existing avatar
router.put('/campaigns/:campaignID/avatars/:avatarID', parseBody(), function (request, response, next) {
	let campaign = request.campaign;
	let avatar = request.avatar;

	avatar.update(request.body).then(
		(result) => { response.json(camapign); },
		(error) => { return next(error); }
	);
});

// Deletes an existing avatar
router.delete('/campaigns/:campaignID/avatars/:avatarID', function (request, response, next) {
	let campaign = request.campaign;
	let avatar = request.avatar;

	avatar.remove().then(
		(avatar) => {
			campaign.save().then(
				(campaign) => { response.json(campaign); },
				(error) => { next(error); }
			);
		},
		(error) => { next(error); }
	);
});

// Get posts' list (associated to a campaign)
router.get('/campaigns/:campaignID/posts', function (request, response, next) {
	let limit = request.query.limit || 20;
	let page = request.query.page || 1;

	let query = Post.Find({ campaign: request.params.campaignID }).limit(limit).skip(limit * (page - 1));

	query.exec().then(
		(posts) => { response.json(posts) },
		(error) => { next(error); }
	);
});

// Get an existing post
router.get('/campaigns/:campaignID/posts/:postID', function (request, response, next) {
	let post = request.post;

	response.json(post);
});

// Add a new post
router.post('/campaigns/:campaignID/posts', parseBody(), function (request, response, next) {
	let post = new Post(request.body);

	// post.campaign === request.params.campaignID; (check)

	post.save().then(
		(post) => { response.status(201).json(post); },
		(error) => { next(error); }
	);
});

// Modify an existing post
router.put('/campaigns/:campaignID/posts/:postID', parseBody(), function (request, response, next) {
	let post = request.post;

	post.update(request.body).then(
		(post) => { response.json(post); },
		(error) => { next(error); }
	);
});

// Deletes an existing post
router.delete('/campaigns/:campaignID/posts/:postID', function (request, response, next) {
	let post = request.post;

	post.remove().then(
		(post) => {
			post.save().then(
				(post) => { response.json(post); },
				(error) => { next(error); }
			);
		},
		(error) => { next(error); }
	);
});

module.exports.router = router;