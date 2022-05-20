/**
 * Project: Impiantando
 * API implementation: Sport centers
*/

const express = require('express');
const { response } = require('../app');
const router = express.Router();
const AdminUser = require('../models/admin_user'); // sport center is a user_admin's subdocutment
const Facilities = require('../models/facilities'); 
const Courses = require('../models/course'); 

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('/sport_centers', async (req, res) => {
    let admin_users = await AdminUser.find({});
    let response = admin_users.map( (user) => {
        return {
            self: "/api/v1/sport_centers/" + user.sport_center.id,
            name: user.sport_center.name,
            address: user.sport_center.address,
            description: user.sport_center.description,
            administrator: "/api/v1/admin_users/"+user.id
        };
    });
    res.status(200).json(response);
});

/**
 * In order to create a new sport center it is necessary to create the correponding
 * administrator to ensure data consistency
*/
router.post('/sport_centers', async (req, res) => {
    let admin_name = req.body.name;
    let admin_surname = req.body.surname;
    let admin_email = req.body.email;
    let admin_birthDate = req.body.birth_date;
    let admin_username = req.body.username;
    let admin_password = req.body.password;

    //Check if administrator already exist
    const userExists = await AdminUser.findOne({ name: admin_name, surname: admin_surname}).select("name").lean();
    if (userExists) {res.status(409).send('user already exists'); return;}

    let sport_center_name = req.body.sport_center.name;
    let sport_center_address_city = req.body.sport_center.address.city;
    let sport_center_address_location = req.body.sport_center.address.location;
    let sport_center_description = req.body.sport_center.description;

    //Check if sport center already exists
    const sportCenterExists = await AdminUser.findOne({ 'sport_center.name': sport_center_name }).select("sport_center.name").lean();
    if (sportCenterExists) {res.status(409).send('sport center already exists'); return;}


    let admin = new AdminUser({
        name: admin_name,
        surname: admin_surname,
        email: admin_email,
        birth_date: admin_birthDate,
        username: admin_username,
        password: admin_password,
        sport_center: {
            name: sport_center_name,
            description: sport_center_description,
            address: {city: sport_center_address_city, location: sport_center_address_location}
        } 
    });

    await admin.save();

    let sport_center_id = admin.sport_center.id;

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
    */
    res.location("/api/v1/sport_centers/" + sport_center_id).status(201).send();    
});

router.get('/sport_centers/:id', async (req, res) => {
    let sp_c = await AdminUser.findOne({'sport_center.id':req.params.id});
    let response = {
        self: "/api/v1/sport_centers/"+sp_c.sport_center.id,
        name: sp_c.sport_center.name,
        address: sp_c.sport_center.address,
        description: sp_c.sport_center.description,
        administrator: "/api/v1/admin_users/"+sp_c.id
    }
    res.status(200).json(response);
})

router.get('/sport_centers/:id/sport_facilities', async (req, res) => {
    let facilities = await Facilities.find({id_s_c:req.params.id});
    let response = facilities.map( (facility) => {
        return {
            self: "/api/v1/sport_centers/"+facility.id_s_c+"/sport_facilities/" + facility.id,
            name: facility.name,
            description: facility.description,
            id_s_c:facility.id_s_c,
            sport_center: "/api/v1/sport_centers/"+facility.id_s_c,
        };
    });
    res.status(200).json(response);
});

router.get('/sport_centers/:id/courses', async (req, res) => {
    let courses = await Courses.find({sport_center_id:req.params.id});
    let response = courses.map( (course) => {
        return {
            self: "/api/v1/courses/"+course.id,
            name: course.name,
            description: course.description,
            sport: course.sport,
            sport_facility_id:course.sport_facility_id,
            sport_center_id:course.sport_center_id,
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
            creation_date: course.creation_date,
            sport_facility: "/api/v1/sport_facilities/"+course.sport_facility_id,
            sport_center: "/api/v1/sport_centers/"+course.sport_center_id,
        };
    });
    res.status(200).json(response);
});

module.exports = router

