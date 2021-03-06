/**
 * Project: Impiantando
 * API implementation: Courses subscriptions
*/
const express = require('express');
const { response } = require('../app');
const mongoose = require("mongoose");
const tokenChecker = require('./tokenChecker.js');
const router = express.Router();
const Course = require('../models/course');
const Users = require('../models/utente');


//API user submission
//Submit of a user in a course
//user id and course id have to be passed through the body
router.patch('/registrations', tokenChecker);
router.patch('/registrations', async (req, res, next) => {

    //Check required attributes
    if  ( 
        !req.body.course_id     ||
        !req.body.user_id
    )
    {
        res.status(400).send("Bad input - missing required information");
        return ;
    }

    //Add user to course subscribers
    let course_id = req.body.course_id;
    let user_id = req.body.user_id;

    if(!mongoose.Types.ObjectId.isValid(req.body.course_id) || !mongoose.Types.ObjectId.isValid(req.body.user_id) ){
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    Course.findOneAndUpdate(
    { _id: course_id }, 
    { $push: { users: user_id  } },
    function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            //console.log(success);
        }
    });

    next();

}, async (req, res, next) => {
    
    //Add course to user list of registrations
    let course_id = req.body.course_id;
    let user_id = req.body.user_id;

    Users.findOneAndUpdate(
    { _id: user_id }, 
    { $push: { courses: course_id  } },
    function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            //console.log(success);
        }
    });

    res.status(200).send("OK");
});

//API user submission
//Unsubscribtion of a user in a course
//user id and course id have to be passed through the body
router.patch('/unsubscribe', tokenChecker);
router.patch('/unsubscribe', async (req, res, next) => {

    //Check required attributes
    if  ( 
        !req.body.course_id     ||
        !req.body.user_id
    )
    {
        res.status(400).send("Bad input - missing required information");
        return ;
    }

    //Delete user to course subscribers
    let course_id = req.body.course_id;
    let user_id = req.body.user_id;

    if(!mongoose.Types.ObjectId.isValid(req.body.course_id) || !mongoose.Types.ObjectId.isValid(req.body.user_id) ){
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    Course.findOneAndUpdate(
    { _id: course_id }, 
    { $pull: { users: user_id  } },
    function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            //console.log(success);
        }
    });

    next();

}, async (req, res, next) => {

    //Delete course to user list of registrations
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
            //console.log(success);
        }
    });

    res.status(200).send("OK");
});


module.exports = router