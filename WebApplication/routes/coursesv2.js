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
const ManagerUser = require('../models/manager_user');

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 * 
 * Get all managers of the specified course
 */
router.get('/courses/:id/managers', async (req, res) => {
    let course = await Course.findOne({_id:req.params.id});
    let managers = await ManagerUser.find({_id: {$in: course.managers}});

    console.log(managers);

    let response = managers.map( (manager) => {
        let course_array = manager.courses;
        let links = [];
        course_array.forEach(course => {
            links.push("/api/v1/course/"+course);
        })
        return {
            course: "/api/v1/courses/" + course.id,
            manager: "/api/v1/managers/" + manager.id,
            name: manager.name,
            surname: manager.surname,
            email: manager.email,
            birth_date: manager.birth_date,
            username: manager.username,
            password: manager.password,
            society: manager.society,
            courses_id: manager.courses,
            courses: links
        };
    });
    res.status(200).json(response);
});

module.exports = router