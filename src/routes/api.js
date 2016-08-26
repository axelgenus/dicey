'use strict';

var HttpError = require('../httperror');
var User = require('../data/model/user');
var Avatar = require('../data/model/avatar');
var Campaign = require('../data/model/campaign');
var Post = require('../data/model/post');
var security = require('../security');

var router = require('express').Router();
var parseBody = require('body-parser').json;

// Attach the user model to the request if an userID parameter has been specified
router.param('userID', function (request, response, next, userID) {
	User.findById(userID).then(
		(user) => {
			if (user) {
				request.user = user;
				next();
			}
			else {
				next(new HttpError(404, "User not found"));
			}
		},
		(error) => { next(error); }
	);
});

// Attach the campaign model to the request if an userID parameter has been specified
router.param('campaignID', function (request, response, next, campaignID) {
	Campaign.findById(campaignID).then(
		(campaign) => {
			if (campaign) {
				request.campaign = campaign;
				next();
			}
			else {
				next(new HttpError(404, "Campaign not found"));
			}
		},
		(error) => { next(error); }
	);
});

// Attach the avatar model to the request if an avatarID parameter has been specified
router.param('avatarID', function (request, response, next, avatarID) {
	let avatar = request.campaign.avatars.id(avatarID);

	if (avatar) {
		request.avatar = avatar;
		next();
	}
	else {
		next(new HttpError(404, "Avatar not found"));
	}
});

// Attach the post model to the request if a postID parameter has been specified
router.param('postID', function (request, response, next, postID) {
	Campaign.findById(postID).then(
		(post) => {
			if (post) {
				request.post = post;
				next();
			}
			else {
				next(new HttpError(404, "Post not found"));
			}
		},
		(error) => { next(error); }
	);
});

// Get users' list (with filter)
router.get('/users', security.requireAdmin, function (request, response, next) {
	let limit = request.query.limit || 25;
	let page = request.query.page || 1;

	User.find({}, { password: false }).limit(limit).skip(limit * (page - 1)).then(
		(users) => { response.json(users); },
		(error) => { next(error); }
	);
});

// Get an existing user
router.get('/users/:userID', security.requireUser, function (request, response) {
	let user = request.user.toSafeObject();

	response.json(user);
});

// Modify an existing user
router.put('/users/:userID', security.requireUser, parseBody(), function (request, response, next) {
	request.user.update(request.body).then(
		(user) => {
			user = user.toSafeObject();
			response.json(user);
		},
		(error) => { console.log('err'); next(error); }
	);
});

// Get campaigns' list (with filter)
router.get('/campaigns', function (request, response, next) {
	let limit = request.query.limit || 5;
	let page = request.query.page || 1;

	Campaign.find().limit(limit).skip(limit * (page - 1)).then(
		(campaigns) => { response.json(campaigns); },
		(error) => { next(error); }
	);
});

// Get an existing campaign
router.get('/campaigns/:campaignID', security.requireUser, function (request, response, next) {
	response.json(request.campaign);
});

// Create a new campaign
router.post('/campaigns', security.requireUser, parseBody(), function (request, response, next) {
	Campaign.create(request.body).then(
		(result) => { response.status(201).json(result); },
		(error) => { next(error); }
	);
});

// Modify an existing campaign
router.put('/campaigns/:campaignID', security.requireUser, parseBody(), function (request, response, next) {
	let campaign = request.campaign;

	campaign.update(request.body).then(
		(result) => { response.json(camapign); },
		(error) => { next(error); }
	);
});

// Disables an existing campaign
router.delete('/campaigns/:campaignID', security.requireUser, function (request, response, next) {
	let campaign = request.campaign;

	campaign.disable().then(
		(result) => { response.json(camapign); },
		(error) => { next(error); }
	);
});

// Get avatars' list (associated to a campaign)
router.get('/campaigns/:campaignID/avatars', security.requireUser, function (request, response, next) {
	let campaign = request.campaign;

	response.json(campaign.avatars);
});

// Get an existing avatar
router.get('/campaigns/:campaignID/avatars/:avatarID', security.requireUser, function (request, response, next) {
	let avatar = request.avatar;

	response.json(avatar);
});

// Add a new avatar
router.post('/campaigns/:campaignID/avatars', security.requireUser, parseBody(), function (request, response, next) {
	let campaign = request.campaign;
	let avatar = new Avatar(request.body);

	campaign.avatars.push(avatar);
	campaign.save().then(
		(result) => { response.status(201).json(camapign); },
		(error) => { next(error); }
	);
});

// Modify an existing avatar
router.put('/campaigns/:campaignID/avatars/:avatarID', security.requireUser, parseBody(), function (request, response, next) {
	let campaign = request.campaign;
	let avatar = request.avatar;

	avatar.update(request.body).then(
		(result) => { response.json(camapign); },
		(error) => { next(error); }
	);
});

// Deletes an existing avatar
router.delete('/campaigns/:campaignID/avatars/:avatarID', security.requireUser, function (request, response, next) {
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
router.get('/campaigns/:campaignID/posts', security.requireUser, function (request, response, next) {
	let limit = request.query.limit || 20;
	let page = request.query.page || 1;

	Post.Find({ campaign: request.params.campaignID }).limit(limit).skip(limit * (page - 1)).then(
		(posts) => { response.json(posts) },
		(error) => { next(error); }
	);
});

// Get an existing post
router.get('/campaigns/:campaignID/posts/:postID', security.requireUser, function (request, response, next) {
	let post = request.post;

	response.json(post);
});

// Add a new post
router.post('/campaigns/:campaignID/posts', security.requireUser, parseBody(), function (request, response, next) {
	let post = new Post(request.body);

	// TODO: check if post.campaign === request.params.campaignID

	post.save().then(
		(post) => { response.status(201).json(post); },
		(error) => { next(error); }
	);
});

// Modify an existing post
router.put('/campaigns/:campaignID/posts/:postID', security.requireUser, parseBody(), function (request, response, next) {
	let post = request.post;

	post.update(request.body).then(
		(post) => { response.json(post); },
		(error) => { next(error); }
	);
});

// Deletes an existing post
router.delete('/campaigns/:campaignID/posts/:postID', security.requireUser, function (request, response, next) {
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
