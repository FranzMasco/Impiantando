/**
 * Project: Impiantando
 * API implementation: Managers
*/

const express = require('express');
const { response } = require('../app');
const tokenChecker = require('./tokenChecker.js');
const router = express.Router();
const Managers = require('../models/manager_user');
const Courses = require('../models/course');

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('/managers', async (req, res) => {
    let managers = await Managers.find({});
    let response = managers.map( (manager) => {
        return {
            self: "/api/v2/managers/"+manager.id,
            name: manager.name,
            surname: manager.surname,
            email: manager.email,
            birth_date: manager.birth_date,
            username: manager.username,
            password: manager.password,
            society: manager.society,
            courses: manager.courses,
            sport_center_id: manager.sport_center,
            sport_center: "/api/v2/sport_centers/"+sport_center_id
        };
    });
    res.status(200).json(response);
});

router.post('/managers', tokenChecker);
router.post('/managers', async (req, res) => {
    let manager_name = req.body.name;
    let manager_surname = req.body.surname;
    let manager_email = req.body.email;
    let manager_birth_date = req.body.birth_date;
    let manager_username = req.body.username;
    let manager_password = req.body.password;
    let manager_society = req.body.society;
    let manager_courses = req.body.courses;
    let manager_sport_center_id = req.body.sport_center_id;

    //Check if a manager already exists
    const managersExists = await Managers.findOne({name: manager_name, surname: manager_surname, sport_center: manager_sport_center_id}).select("sport_center").lean();
    if(managersExists) {res.status(400).send('user already exists');return;}

    let manager = new Managers({
        name: manager_name,
        surname: manager_surname,
        email: manager_email,
        birth_date: manager_birth_date,
        username: manager_username,
        password: manager_password,
        society: manager_society,
        courses: manager_courses,
        sport_center: manager_sport_center_id
    })

    await manager.save();
    
    let manager_id = manager.id;
    res.location("/api/v2/managers/"+manager_id).status(201).send();
});

router.get('/managers/:id', async (req, res) => {
    let manager = await Managers.findOne({id:req.params.id});
    let response = {
        self: "/api/v2/managers/"+ manager.id,
        name: manager.name,
        surname: manager.surname,
        email: manager.email,
        birth_date: manager.birth_date,
        username: manager.username,
        password: manager.password,
        society: manager.society,
        courses: manager.courses,
        sport_center_id: manager.sport_center,
        sport_center: "/api/v2/sport_centers/"+manager.sport_center
    }
    res.status(200).json(response);
})

router.get('/managers/:id/courses', async (req, res) => {
    let managers = await Managers.findOne({_id:req.params.id});
    let courses = await Courses.find({_id: {$in: managers.courses}});
    //console.log(courses);
    let response = courses.map( (course) => {
        let managers_array = course.managers;
        let links = [];
        managers_array.forEach(manager => {
            links.push("/api/v2/managers/"+manager);
        })
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
            managers: links
        };
    });
    res.status(200).json(response);
})

//Delets a manager and its references in the courses
router.delete('/managers/:id', tokenChecker);
router.delete('/managers/:id', async (req, res) => {
    let manager = await Managers.findById(req.params.id).exec();
    
    if (!manager) {
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }
    let managers = await Managers.findOne({_id:req.params.id});
    let courses = await Courses.find({_id: {$in: managers.courses}});

    courses.forEach(course => {
        console.log(course.name+" "+course._id+" "+req.params.id );
        Courses.findByIdAndUpdate({_id:course._id},{$pull:{managers:req.params.id}},function (error, success) {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                console.log(success);
            }
        });
    });
    await manager.deleteOne();
    res.status(204).json({status: "success"});
});


router.patch('/managers/:id', tokenChecker);
router.patch('/managers/:id', async (req, res) => {
    Managers.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((manager) => {
        if (!manager) {
            return res.status(404).send();
        }
        res.status(200).send(manager);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

module.exports = router