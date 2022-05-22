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
            self: "/api/v1/courses/"+course.id,
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
            sport_facility: "/api/v1/sport_facilities/"+course.sport_facility_id,
            sport_center: "/api/v1/sport_centers/"+course.sport_center_id,
            course: "/api/v1/courses/"+course.id
        };
    });
    res.status(200).json(response);
});

module.exports = router