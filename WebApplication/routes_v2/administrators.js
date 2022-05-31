/**
 * Project: Impiantando
 * API implementation: Managers
*/

const express = require('express');
const { response } = require('../app');
const router = express.Router();
const AdminUser = require('../models/admin_user');

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
 router.get('/administrators', async (req, res) => {
    let admin_users = await AdminUser.find({});
    let response = admin_users.map( (user) => {
        return {
            self: "/api/v2/administrators/" + user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            birth_date: user.birth_date,
            username: user.username,
            password: user.password,
            sport_center: "/api/v2/sport_centers/"+user.sport_center.id
        };
    });
    res.status(200).json(response);
});

router.get('/administrators/:id', async (req, res) => {
    let admin = await AdminUser.findOne({id:req.params.id});
    let response = {
            self: "/api/v2/administrators/" + admin.id,
            name: admin.name,
            surname: admin.surname,
            email: admin.email,
            birth_date: admin.birth_date,
            username: admin.username,
            password: admin.password,
            sport_center: "/api/v2/sport_centers/"+admin.sport_center.id
        };
    res.status(200).json(response);
});

module.exports = router