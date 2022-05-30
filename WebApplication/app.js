//Express App initialization
const express = require("express");
const app = express();
const cors = require("cors");
//...

//Resource REST API VERSION 1
const authentication = require('./routes/authentications.js');

const sport_centers = require('./routes/sport_centers.js');
const sport_facilities = require('./routes/sport_facilities.js');
const courses = require('./routes/courses.js');
const users = require('./routes/users.js');
const managers = require('./routes/managers.js');
const registrations = require('./routes/subscriptions.js');


//Resource REST API VERSION 2
const coursesv2 = require('./routes_v2/courses.js');
const managersv2 = require('./routes_v2/managers.js');
const sport_centersv2 = require('./routes_v2/sport_centers.js');
const subscriptionsv2 = require('./routes/subscriptionsv2.js');
const news = require('./routes_v2/news');
const usersv2 = require('./routes_v2/users.js');
const sport_facilitiesv2 = require('./routes_v2/sport_facilities.js');
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
//Sport center API
app.use("/api/v1", sport_centers)
app.use("/api/v2", sport_centersv2)

//Sport facilities API
app.use("/api/v1", sport_facilities)
app.use("/api/v2", sport_facilitiesv2)

//Courses API
app.use("/api/v1", courses)
app.use("/api/v2", coursesv2)

//Managers API
app.use("/api/v1", managers)
app.use("/api/v2", managersv2)
//...

//User API
app.use("/api/v1", users)
app.use("/api/v2", usersv2)
//...

//User registration
app.use("/api/v1", registrations);
//...

//User registration and unsubscribe
app.use("/api/v2", subscriptionsv2);
//...

//News API
app.use("/api/v2/", news);
//...

//Default 404 handler
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});
//...

module.exports = app;