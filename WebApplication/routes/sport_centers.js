/**
 * Project: Impiantando
 * API implementation: Sport centers
*/

const express = require('express');
const { response } = require('../app');
const router = express.Router();
const AdminUser = require('../models/admin_user'); // sport center is a user_admin's subdocutment

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

module.exports = router