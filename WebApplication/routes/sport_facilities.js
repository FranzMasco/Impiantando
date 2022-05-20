/**
 * Project: Impiantando
 * API implementation: Sport facilities
*/

const express = require('express');
const { response } = require('../app');
const router = express.Router();
const Facilities = require('../models/facilities'); 

router.get('/sport_facilities', async (req, res) => {
    let sport_facilities = await Facilities.find({});
    let response = sport_facilities.map( (facility) => {
        return {
            self: "/api/v1/sport_facilities/"+facility.id,
            name: facility.name,
            description: facility.description,
            id_s_c: facility.id_s_c,
            sport_center: "/api/v1/sport_centers/"+facility.id_s_c
        };
    });
    res.status(200).json(response);
})

router.post('/sport_facilities', async (req, res) => {
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
    res.location("/api/v1/sport_centers/:id/sport_facilities" + sport_facility_id).status(201).send();    
});

router.get('/sport_facilities/:id', async (req, res) => {
    let facility = await Facilities.findOne({'_id':req.params.id});
    let response = {
            self: "/api/v1/sport_facilities/"+facility.id,
            name: facility.name,
            description: facility.description,
            id_s_c: facility.id_s_c,
            sport_center: "/api/v1/sport_centers/"+facility.id_s_c
        };
    res.status(200).json(response);
})

module.exports = router