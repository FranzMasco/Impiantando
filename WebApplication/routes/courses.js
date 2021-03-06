/**
 * Project: Impiantando
 * API implementation: Courses
*/

const express = require('express');
const { response } = require('../app');
const tokenChecker = require('./tokenChecker.js');
const router = express.Router();
const Course = require('../models/course');
const Users = require('../models/utente');

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('/courses', async (req, res) => {
    let courses = await Course.find({});
    let response = courses.map( (course) => {
        let managers_array = course.managers;
        let links = [];
        managers_array.forEach(manager => {
            links.push("/api/v1/managers/"+manager);
        })
        return {
            self: "/api/v1/courses/" + course.id,
            name: course.name,
            description: course.description,
            sport: course.sport,
            sport_facility_id:course.sport_facility_id,
            sport_center_id:course.sport_center_id,
            sport_facility: "/api/v1/sport_facilities/"+course.sport_facility_id,
            sport_center: "/api/v1/sport_centers/"+course.sport_center_id,
            managers_id: course.managers,
            users: course.users,
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
            managers: links
        };
    });
    res.status(200).json(response);
});

/**
 * In order to create a new sport center it is necessary to create the correponding
 * administrator to ensure data consistency
*/
router.post('/courses', tokenChecker);
router.post('/courses', async (req, res) => {
    let course_name = req.body.name;
    let course_description = req.body.description;
    let course_sport = req.body.sport;
    let course_sport_facility_id = req.body.sport_facility_id;
    let course_sport_center_id = req.body.sport_center_id;
    let course_managers_id = [];
    let course_users_id = [];
    let course_reviews = [];
    let course_periodic = req.body.periodic;
    let course_specific_date = req.body.specific_date;
    let course_specific_start_time = req.body.specific_start_time;
    let course_specific_end_time = req.body.specific_end_time;
    let course_start_date = req.body.start_date;
    let course_end_date = req.body.end_date;
    let course_time_schedules_monday = req.body.time_schedules_monday;
    let course_time_schedules_tuesday = req.body.time_schedules_tuesday;
    let course_time_schedules_wednesday = req.body.time_schedules_wednesday;
    let course_time_schedules_thursday = req.body.time_schedules_thursday;
    let course_time_schedules_friday = req.body.time_schedules_friday;
    let course_time_schedules_saturday = req.body.time_schedules_saturday;
    let course_time_schedules_sunday = req.body.time_schedules_sunday;
    let course_exceptions = req.body.exceptions;
    let course_creation_date = req.body.creation_date;

    //console.log(course_time_schedules_wednesday.event[0]);

    //Check if course already exists
    const courseExists = await Course.findOne({name: course_name, sport_facility: course_sport_facility_id}).select("name").lean();
    if (courseExists) {res.status(409).send('course already exists'); return;}

    //Check if the sport facility exists


    let course = new Course({
        name: course_name,
        description: course_description,
        sport: course_sport,
        sport_facility_id: course_sport_facility_id,
        sport_center_id: course_sport_center_id,
        managers: course_managers_id,
        users: course_users_id,
        reviews: course_reviews,
        periodic: course_periodic,
        specific_date: course_specific_date,
        specific_start_time: course_specific_start_time,
        specific_end_time: course_specific_end_time,
        start_date: course_start_date,
        end_date: course_end_date,
        time_schedules: {
            monday: course_time_schedules_monday,
            tuesday: course_time_schedules_tuesday,
            wednesday: course_time_schedules_wednesday,
            thursday: course_time_schedules_thursday,
            friday: course_time_schedules_friday,
            saturday: course_time_schedules_saturday,
            sunday: course_time_schedules_sunday
        },
        exceptions: course_exceptions,
        creation_date: course_creation_date
    });

    await course.save();

    let course_id = course.id;

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
    */
    res.location("/api/v1/courses/" + course_id).status(201).send();    
});

router.get('/courses/:id', async (req, res) => {
    let course = await Course.findOne({'_id':req.params.id});
    let managers_array = course.managers;
    let links = [];
    managers_array.forEach(manager => {
        links.push("/api/v1/managers/"+manager);
    })
    let response = {
            self: "/api/v1/courses/" + course.id,
            name: course.name,
            description: course.description,
            sport: course.sport,
            sport_facility_id:course.sport_facility_id,
            sport_center_id:course.sport_center_id,
            sport_facility: "/api/v1/sport_facilities/"+course.sport_facility_id,
            sport_center: "/api/v1/sport_centers/"+course.sport_center_id,
            managers_id: course.managers,
            users: course.users,
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
            managers: links
        };
    res.status(200).json(response);
});

router.get('/courses/:id/users', tokenChecker);
router.get('/courses/:id/users', async (req, res) => {
    let courses = await Course.findOne({_id:req.params.id});
    let users = await Users.find({_id: {$in: courses.users}});
    let response = users.map( (user) => {
        return {
            self: "/api/v1/course/" + req.params.id+"/users/"+user.id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            user: "/api/v1/users/"+user.id
        };
    });
    res.status(200).json(response);
});

router.delete('/courses/:id', tokenChecker);
router.delete('/courses/:id', async (req, res) => {
    let course = await Course.findById(req.params.id).exec();
    if (!course) {
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }
    await course.deleteOne()
    res.status(204).json({status: "success"});
});

router.patch('/courses/:id', tokenChecker);
router.patch('/courses/:id', async (req, res) => {
    Course.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((course) => {
        if (!course) {
            return res.status(404).send();
        }
        res.status(200).send(course);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

module.exports = router