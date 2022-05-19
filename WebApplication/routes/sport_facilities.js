/**
 * Project: Impiantando
 * API implementation: Sport facilities
*/

const express = require('express');
const { response } = require('../app');
const router = express.Router();
const Facilities = require('../models/facilities'); 

router.post('/sport_facilities', async (req, res) => {
    let facility_name = req.body.name;
    let facility_description = req.body.description;
    let facility_id_s_c = req.body.id_s_c;

    //Check if a facility already exists
    const facilitiesExists = await Facilities.findOne({ 'name': facility_name, 'description': facility_description,'id_s_c':facility_id_s_c}).select("name").lean();
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
    res.location("/api/v1/sport_centers/:id/sport_facilities" + sport_facility_id).status(201).send();    
});

module.exports = router