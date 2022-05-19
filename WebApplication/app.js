//Express App initialization
const express = require("express");
const app = express();
//...

//Resource REST API
const r_centri_sportivi = require('./routes/r_centri_sportivi.js');
const r_utenti_prova = require('./routes/r_utenti_prova.js');
const sport_centers = require('./routes/sport_centers.js');
const courses = require('./routes/courses.js');
//...

//Configure Express.js parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//...

//Serve front-end static files
app.use('/', express.static('public'));
//...

//Resource routing
app.use("/api/v1", r_centri_sportivi)
app.use("/api/v1", r_utenti_prova)
app.use("/api/v1", sport_centers)
app.use("/api/v1", courses)
//...

//Default 404 handler
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});
//...

module.exports = app;