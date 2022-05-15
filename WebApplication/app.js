//Express App initialization
const express = require("express");
const app = express();
//...

//Serve front-end static files
app.use('/', express.static('public'));
//...


module.exports = app;