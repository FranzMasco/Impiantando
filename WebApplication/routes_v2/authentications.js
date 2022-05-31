/**
 * Project: Impiantando
 * API implementation: User authentication
 * Content: admin authentication, rappresentative authentication, standard user authentication
*/

const express = require('express');
const router = express.Router();
const AdminUser = require('../models/admin_user');
const Utente = require('../models/utente');
const Responsabile = require('../models/manager_user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

/**
 * Route to authenticate admin user and get a new token
*/
router.post('/authentications/admin', async function(req, res) {

	// find the user
	let user = await AdminUser.findOne({
		username: req.body.username
	}).exec();

	// user not found
	if (!user) {
		res.status(404).json({ success: false, username: false, message: 'Authentication failed. User not found.' });
		return;
	}
	
	// check if password matches
	if (user.password != req.body.password) {
		res.status(404).json({ success: false, username: true, password: false, message: 'Authentication failed. Wrong password.' });
		return;
	}
	
	// if user is found and password is right create a token
	var payload = {
		username: user.username,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.status(200).json({
		success: true,
		message: 'Authentication OK',
		user: "administrator",
		token: token,
		username: user.username,
		id: user._id,
		sport_center: user.sport_center,
		sport_center_ref: "api/v2/sport_centers/"+user.sport_center._id,
		self: "api/v2/administrators/" + user._id
	});

});

/**
 * Route to authenticate user and get a new token
*/
router.post('/authentications/user', async function(req, res) {

	// find the user
	let user = await Utente.findOne({
		username: req.body.username
	}).exec();

	// user not found
	if (!user) {
		res.status(404).json({ success: false, username: false, message: 'Authentication failed. User not found.' });
		return;
	}
	
	// check if password matches
	if (user.password != req.body.password) {
		res.status(404).json({ success: false, username: true, password: false, message: 'Authentication failed. Wrong password.' });
		return;
	}
	
	// if user is found and password is right create a token
	var payload = {
		username: user.username,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.status(200).json({
		success: true,
		message: 'Authentication OK',
		user: "user",
		token: token,
		username: user.username,
		id: user._id,
		self: "api/v2/users/" + user._id
	});

});

/**
 * Route to course manager and get a new token
*/
router.post('/authentications/responsabile', async function(req, res) {

	// find the user
	let user = await Responsabile.findOne({
		username: req.body.username
	}).exec();

	// user not found
	if (!user) {
		res.status(404).json({ success: false, username: false, message: 'Authentication failed. User not found.' });
		return;
	}
	
	// check if password matches
	if (user.password != req.body.password) {
		res.status(404).json({ success: false, username: true, password: false, message: 'Authentication failed. Wrong password.' });
		return;
	}
	
	// if user is found and password is right create a token
	var payload = {
		username: user.username,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.status(200).json({
		success: true,
		message: 'Authentication OK',
		user: "responsabile",
		token: token,
		username: user.username,
		id: user._id,
		self: "api/v2/managers/" + user._id
	});

});

module.exports = router;