/**
 * Project: Impiantando
 * API implementation: Sport facilities
*/

const express = require('express');
const { response } = require('../app');
const router = express.Router();
const Users = require('../models/utente'); 

router.get('/users/:id/courses', async (req, res) => {
    let users = await Users.find({'_id':req.params.id});

    let response = users.map( (user) => {
        return {
            self: "/api/v1/users/" + req.params.id,
            name:user.name,
            surname: user.surname,
            username: user.username,
            course_name: user.courses.name,
            course_description: user.courses.description,
            courses: user.courses.course,
        };
    });
    res.status(200).json(response);
});

module.exports = router