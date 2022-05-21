//Express App initialization
const express = require("express");
const app = express();
const cors = require("cors");
//...

//Resource REST API
const authentication = require('./routes/authentications.js');

const r_centri_sportivi = require('./routes/r_centri_sportivi.js');
const r_utenti_prova = require('./routes/r_utenti_prova.js');
const sport_centers = require('./routes/sport_centers.js');
const sport_facilities = require('./routes/sport_facilities.js');
const courses = require('./routes/courses.js');
const users = require('./routes/users.js');
const managers = require('./routes/managers.js');
//...

//Configure Express.js parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//...

/**
 * CORS requests
 */
 //app.use(cors());

//Serve front-end
app.use('/', express.static('public'));
//...

//Authentication
app.use('/api/v1', authentication);

//Resource routing
app.use("/api/v1", r_centri_sportivi)
app.use("/api/v1", r_utenti_prova)

//Sport center API
app.use("/api/v1", sport_centers)

//Sport facilities API
app.use("/api/v1", sport_facilities)

//Courses API
app.use("/api/v1", courses)

//Managers API
app.use("/api/v1", managers)
//...

//User API
app.use("/api/v1", users)
//...

//Default 404 handler
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});
//...

module.exports = app;