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
    let courses = await Courses.find({sport_center_id:req.params.id});

    let managersss= [];
    courses.forEach(course => {
        course.managers.forEach(course2 => {
            managersss.push(course2);
        })
    })

    let managers = await Managers.find({_id: {$in: managersss}})

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
module.exports = router