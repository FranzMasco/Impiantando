const express = require('express');
const { response } = require('../app');
const router = express.Router();
const Courses = require('../models/course'); 
const Managers = require('../models/manager_user'); 
/*
router.get('/sport_centers/:id/managers', async (req, res) => {
    let courses = await Courses.find({sport_center_id:req.params.id});
    let managers = await Managers.find({_id: {$in: courses.managers}})

    let response = managers.map( (manager) => {
        return {
            self: "/api/v2/sport_centers/"+req.params.id+"/managers/",
            name: manager.name,
            surname: manager.surname,
            email:manager.email,
        };
    });
    res.status(200).json(response);
});
*/

router.get('/sport_centers/:id/managers', async (req, res) => {
    let managers = await Managers.find({sport_center:req.params.id});

    let response = managers.map( (manager) => {

        let courses_array = manager.courses;
        let links = [];
        courses_array.forEach(course => {
            links.push("/api/v2/courses/"+course);
        })

        return {
            self: "/api/v2/managers/"+manager.id,
            sport_center: "/api/v2/sport_centers/"+req.params.id,
            sport_center_id: manager.sport_center_id,
            name: manager.name,
            surname: manager.surname,
            email:manager.email,
            society:manager.society,
            birth_date: manager.birth_date,
            courses_id: manager.courses,
            courses: links
        };
    });
    res.status(200).json(response);
});
module.exports = router