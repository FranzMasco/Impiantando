/**
 * Project: Impiantando
 * API implementation: Courses
*/

const express = require('express');
const { response } = require('../app');
const router = express.Router();
const Course = require('../models/course'); // sport center is a user_admin's subdocutment

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('/courses', async (req, res) => {
    let courses = await Course.find({});
    let response = courses.map( (course) => {
        return {
            self: "/api/v1/courses/" + course.courses_id,
            name: course.name,
            description: course.description,
            sport: course.sport,
            sport_facility: "/api/v1/sport_facilities/"+course.sport_facility,
            managers: course.managers,
            reviews: course.reviews,
            periodic: course.periodic,
            specific_date: course.specific_date,
            specific_start_time: course.specific_start_time,
            specific_end_time: course.specific_end_time,
            start_date: course.start_date,
            end_date: course.end_date,
            time_schedules: course.time_schedules,
            exceptions: course.exceptions,
            creation_date: course.creation_date
        };
    });
    res.status(200).json(response);
});

/**
 * In order to create a new sport center it is necessary to create the correponding
 * administrator to ensure data consistency
*/
router.post('/courses', async (req, res) => {
    let course_name = req.body.name;
    let course_description = req.body.description;
    let course_sport = req.body.sport;
    let course_sport_facility_id = req.body.sport_facility_id;
    let course_managers_id = [];
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
        managers: course_managers_id,
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

module.exports = router