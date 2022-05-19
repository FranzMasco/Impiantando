/**
 * Project: Impiantando
 * API implementation: User authentication
 * Content: admin authentication, rappresentative authentication, standard user authentication
*/

const express = require('express');
const router = express.Router();
const AdminUser = require('../models/admin_user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

/**
 * Route to authenticate admin user and get a new token
*/
router.post('/authentications/admin', async function(req, res) {
	
	// find the user
	let user = await Student.findOne({
		email: req.body.email
	}).exec();
	
	// user not found
	if (!user) {
		res.json({ success: false, message: 'Authentication failed. User not found.' });
	}
	
	// check if password matches
	if (user.password != req.body.password) {
		res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	}
	
	// if user is found and password is right create a token
	var payload = {
		email: user.email,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		id: user._id,
		self: "api/v1/" + user._id
	});

});



module.exports = router;