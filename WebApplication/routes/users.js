/**
 * Project: Impiantando
 * API implementation: Sport facilities
*/

const express = require('express');
const { response } = require('../app');
const router = express.Router();
const Users = require('../models/utente'); 
const Courses = require('../models/course'); 

router.get('/users/:id/courses', async (req, res) => {
    let users = await Users.findOne({_id:req.params.id});
    let courses = await Courses.find({_id: {$in: users.courses}});
    let response = courses.map( (course) => {
        return {
            self: "/api/v1/users/" + req.params.id+"/courses/"+course.id,
            name: users.name,
            surname: users.surname,
            username: users.username,
            course_name: course.name,
            course_description: course.description,
            course: "/api/v1/courses/"+course.id
        };
    });
    res.status(200).json(response);
});

module.exports = router