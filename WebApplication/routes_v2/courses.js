/**
 * Project: Impiantando
 * API implementation: Courses
*/

const express = require('express');
const mongoose = require("mongoose");
const { response } = require('../app');
const tokenChecker = require('./tokenChecker.js');
const router = express.Router();
const Course = require('../models/course');
const Users = require('../models/utente');
const ManagerUser = require('../models/manager_user');
const News = require('../models/news');

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
            links.push("/api/v2/managers/"+manager);
        })
        return {
            self: "/api/v2/courses/" + course.id,
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
        creation_date: course_creation_date
    });

    await course.save();

    let course_id = course.id;

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
    */
    res.location("/api/v2/courses/" + course_id).status(201).send();    
});

router.get('/courses/:id', async (req, res) => {
    let course = await Course.findOne({'_id':req.params.id});
    let managers_array = course.managers;
    let links = [];
    managers_array.forEach(manager => {
        links.push("/api/v2/managers/"+manager);
    })
    let response = {
            self: "/api/v2/courses/" + course.id,
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
    res.status(200).json(response);
});

router.get('/courses/:id/users', tokenChecker);
router.get('/courses/:id/users', async (req, res) => {
    let courses = await Course.findOne({_id:req.params.id});
    let users = await Users.find({_id: {$in: courses.users}});
    let response = users.map( (user) => {
        return {
            self: "/api/v2/course/" + req.params.id+"/users/"+user.id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            user: "/api/v2/users/"+user.id
        };
    });
    res.status(200).json(response);
});

//Get course news
router.get('/courses/:id/news', async (req, res) => {    
    let courses = await Course.findOne({_id:req.params.id});

    if (!courses) {
        res.status(404).send()
        console.log('resource not found')
        return;
    }

    //NOTE: display only top three latest news
    let news = await News.find({course_id: courses.id}).sort({pubblication_date: "desc"}).limit(3).exec();

    let response = news.map( (single_news) => {
        return {
            self: "/api/v2/news/"+single_news.id,
            course: "/api/v2/courses/"+courses.id,
            text: single_news.text,
            pubblication_date: single_news.pubblication_date
        };
    });
    res.status(200).json(response);
});

router.get('/courses/:id/participants_number', async (req, res) => {
    let courses = await Course.findOne({_id:req.params.id});

    if(!courses){
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    let num_users = await Users.find({_id: {$in: courses.users}}).count();

    let response = {
        self: "/api/v2/course/"+req.params.id,
        partecipants: num_users
    };
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

    //Delete all the references in Manager collection
    ManagerUser.updateMany({courses : course.id},{$pull:{courses:course.id}}, function (err, result) {
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



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 * 
 * Get all managers of the specified course
 */
router.get('/courses/:id/managers', async (req, res) => {
    let course = await Course.findOne({_id:req.params.id});
    let managers = await ManagerUser.find({_id: {$in: course.managers}});

    let response = managers.map( (manager) => {
        let course_array = manager.courses;
        let links = [];
        course_array.forEach(course => {
            links.push("/api/v2/course/"+course);
        })
        return {
            course: "/api/v2/courses/" + course.id,
            manager: "/api/v2/managers/" + manager.id,
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

/**Assign course manager*/
router.patch('/courses/:id/managers', tokenChecker);
router.patch('/courses/:id/managers', async (req, res, next) => {

    //Add manager to course list of managers
    let course_id = req.params.id;
    let manager_id = req.body.manager_id;

    Course.findOneAndUpdate(
    { _id: course_id }, 
    { $push: { managers: manager_id  } },
    function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log(success);
        }
    });

    next();

}, async (req, res, next) => {

    //Add course to manger list of courses
    let course_id = req.params.id;
    let manager_id = req.body.manager_id;

    ManagerUser.findOneAndUpdate(
    { _id: manager_id }, 
    { $push: { courses: course_id  } },
    function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log(success);
        }
    });

    res.status(200).send("OK");
});
/**---*/

/**Remove manager from the course*/
router.delete('/courses/:id/managers', tokenChecker);
router.delete('/courses/:id/managers', async (req, res, next) => {

    //Remove manager from course list of managers
    let course_id = req.params.id;
    let manager_id = req.body.manager_id;

    Course.findOneAndUpdate(
    { _id: course_id }, 
    { $pull: { managers: manager_id  } },
    function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log(success);
        }
    });

    next();

}, async (req, res, next) => {

    //Remove course from manager list of courses
    let course_id = req.params.id;
    let manager_id = req.body.manager_id;

    ManagerUser.findOneAndUpdate(
    { _id: manager_id }, 
    { $pull: { courses: course_id  } },
    function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log(success);
        }
    });

    res.status(200).send("OK");
});
/**---*/

//Get latest reviews and reviews average
router.get('/courses/:id/reviews', async (req, res) => {
    let course_id = req.params.id;
    
    try{
        var course = await Course.findOne({_id:course_id});
    }catch(err){
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }
    
    if (!course) {
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }

    var sum=0;
    for(review in course.reviews){
        sum+=course.reviews[review]["vote"];
    }

    //Prepare only the last 5 news
        latest_reviews = course.reviews;
        //console.log("latest_reviews = "+latest_reviews);
        //i. Sort by pubblication date
        function custom_sort(a, b) {
            //return new Date(a.date).getTime() - new Date(b.date).getTime();
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }        
        latest_reviews.sort(custom_sort);
        //console.log("latest_reviews = "+latest_reviews);

        //ii. Take only first five elements
        latest_reviews = latest_reviews.slice(0, 5)
        //console.log("latest_reviews = "+latest_reviews);
    //...

    let response =
        {
            course: "/api/v2/courses/" + course.id,
            reviews: latest_reviews,
            average: sum/course.reviews.length
        };

    res.status(200).json(response);

    
});

//Add a review
router.patch('/courses/:id/reviews', tokenChecker);
router.patch('/courses/:id/reviews', async (req, res) => {
    //Add review to course list of reviews
    let course_id = req.params.id;
    let review = req.body.review;

    Course.findOneAndUpdate(
    { _id: course_id }, 
    { $push: { reviews: {vote: Number(review)}} },
    function (error, success) {
        if (error) {
            res.status(500).send(error);
        }else{
            res.status(200).send("OK");  
        }
    });
});

module.exports = router