/**
 * Project: Impiantando
 * API implementation: Courses subscriptions
*/
const express = require('express');
const { response } = require('../app');
const tokenChecker = require('./tokenChecker.js');
const router = express.Router();
const Course = require('../models/course');
const Users = require('../models/utente');


//API user submission
//Submit of a user in a course
//user id and course id have to be passed through the body
router.patch('/unsubscribe', tokenChecker);
router.patch('/unsubscribe', async (req, res, next) => {

    //Add user to course subscribers
    let course_id = req.body.course_id;
    let user_id = req.body.user_id;

    Course.findOneAndUpdate(
    { _id: course_id }, 
    { $pull: { users: user_id  } },
    function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log(success);
        }
    });

    next();

}, async (req, res, next) => {

    //Add course to user list of registrations
    let course_id = req.body.course_id;
    let user_id = req.body.user_id;

    Users.findOneAndUpdate(
    { _id: user_id }, 
    { $pull: { courses: course_id  } },
    function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log(success);
        }
    });

    res.status(200).send("OK");
});


module.exports = router