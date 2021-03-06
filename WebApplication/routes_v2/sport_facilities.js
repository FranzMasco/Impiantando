/**
 * Project: Impiantando
 * API implementation: Sport facilities
*/

const express = require('express');
const { response } = require('../app');
const mongoose = require("mongoose");
const tokenChecker = require('./tokenChecker.js');
const router = express.Router();
const Facilities = require('../models/facilities');
const Course = require('../models/course');
const Managers = require('../models/manager_user');
const News = require('../models/news');
const Users = require('../models/utente');

router.get('/sport_facilities', async (req, res) => {
    let sport_facilities = await Facilities.find({});
    let response = sport_facilities.map( (facility) => {
        return {
            self: "/api/v2/sport_facilities/"+facility.id,
            name: facility.name,
            description: facility.description,
            id_s_c: facility.id_s_c,
            sport_center: "/api/v2/sport_centers/"+facility.id_s_c
        };
    });
    res.status(200).json(response);
})

router.post('/sport_facilities', tokenChecker);
router.post('/sport_facilities', async (req, res) => {

    //Check required attributes
    if  ( 
        !req.body.name     ||
        !req.body.id_s_c
    )
    {
        res.status(400).send("Bad input - missing required information");
        return ;
    }

    let facility_name = req.body.name;
    let facility_description = req.body.description;
    let facility_id_s_c = req.body.id_s_c;

    //Check if a facility already exists
    const facilitiesExists = await Facilities.findOne({ 'name': facility_name,'id_s_c':facility_id_s_c}).select("name").lean();
    if (facilitiesExists) {res.status(409).send('facility already exists'); return;}

    let facility = new Facilities({
        name: facility_name,
        description: facility_description,
        id_s_c: facility_id_s_c,
    });

    await facility.save();

    let sport_facility_id = facility.id;

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
    */
    res.location("/api/v2/sport_facilities/" + sport_facility_id).status(201).send();    
});

router.get('/sport_facilities/:id', async (req, res) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    let facility = await Facilities.findOne({'_id':req.params.id});

    if (!facility) {
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    let response = {
            self: "/api/v2/sport_facilities/"+facility.id,
            name: facility.name,
            description: facility.description,
            id_s_c: facility.id_s_c,
            sport_center: "/api/v2/sport_centers/"+facility.id_s_c
        };
    res.status(200).json(response);
})

router.delete('/sport_facilities/:id', tokenChecker);
router.delete('/sport_facilities/:id', async (req, res) => {
    
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }
    
    let sport_facility = await Facilities.findById(req.params.id).exec();
    if (!sport_facility) {
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    //Delete all the courses in the given sport facility
    let courses = await Course.find({sport_facility_id: sport_facility.id});
    courses.forEach(course => {
        //Delete all the references in Manager collection
        Managers.updateMany({courses : course.id},{$pull:{courses:course.id}}, function (err, result) {
            if (err){
                console.log(err)
            }
        });
        //...

        //Delete all the news which are about the course
        News.deleteMany({course_id: course.id}).catch(function(error){
            console.log(error); // Failure
        });
        //...

        //Delete all the references in User collection
        Users.updateMany({courses : course.id}, {$pull:{courses:course.id}}, function (err, result) {
            if (err){
                console.log(err)
            }
        });
        //...
    });

    Course.deleteMany({sport_facility_id: sport_facility.id}).catch(function(error){
        console.log(error); // Failure
    });
    //...

    await sport_facility.deleteOne();
    res.status(204).send();
});

router.patch('/sport_facilities/:id', tokenChecker);
router.patch('/sport_facilities/:id', async (req, res) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    Facilities.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((sport_facility) => {
        if (!sport_facility) {
            return res.status(404).json({status: "error"})
        }
        res.status(200).send(sport_facility);
    }).catch((error) => {
        res.status(500).send(error);
    })
});


router.get('/sport_facilities/:id/courses', async (req, res) => {
    
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    let sportFacility = await Facilities.findOne({_id:req.params.id});

    if (!sportFacility) {
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    let courses = await Course.find({sport_facility_id: sportFacility.id});

    let response = courses.map( (course) => {
        let managers_array = course.managers;
        let links = [];
        managers_array.forEach(manager => {
            links.push("/api/v2/managers/"+manager);
        })
        return {
            course: "/api/v2/courses/" + course.id,
            name: course.name,
            description: course.description,
            sport: course.sport,
            sport_facility_id:course.sport_facility_id,
            sport_center_id:course.sport_center_id,
            sport_facility: "/api/v2/sport_facilities/"+course.sport_facility_id,
            sport_center: "/api/v2/sport_centers/"+course.sport_center_id,
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
            creation_date: course.creation_date,
            managers: links
        };
    });
    res.status(200).json(response);
})

module.exports = router