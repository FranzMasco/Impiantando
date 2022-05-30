/**
 * Project: Impiantando
 * API implementation: Users
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
            self: "/api/v2/courses/"+course.id,
            name: course.name,
            description: course.description,
            sport: course.sport,
            sport_facility_id:course.sport_facility_id,
            sport_center_id:course.sport_center_id,
            managers_id: course.managers,
            reviews: course.reviews,
            periodic: course.periodic,
            specific_date: course.specific_date,
            specific_start_time: course.specific_start_time,
            specific_end_time: course.specific_end_time,
            start_date: course.start_date,
            end_date: course.end_date,
            time_schedules: course.time_schedules,
            exceptions: course.exceptions,
            creation_date: course.creation_date,
            sport_facility: "/api/v2/sport_facilities/"+course.sport_facility_id,
            sport_center: "/api/v2/sport_centers/"+course.sport_center_id,
            course: "/api/v2/courses/"+course.id
        };
    });
    res.status(200).json(response);
});


router.post('/users', async (req, res) => {
    let user_name = req.body.name;
    let user_surname = req.body.surname;
    let user_email = req.body.email;
    let user_birth_date = req.body.birth_date;
    let user_username = req.body.username;
    let user_password = req.body.password;
    let user_courses = req.body.courses;

    //Check if a manager already exists
    const userExists = await Users.findOne({username: user_username}).select("name").lean();
    if(userExists) {res.status(400).send('user already exists');return;}

    let user = new Users({
        name: user_name,
        surname: user_surname,
        email: user_email,
        birth_date: user_birth_date,
        username: user_username,
        password: user_password,
        courses: user_courses
    })

    await user.save();
    
    let user_id = user.id;
    res.location("/api/v2/users/"+user_id).status(201).send();
});

module.exports = router