//Authenticated user mongoose model
//Structure:
/*
_id : entity identifier
name
surname
email
birth_date
username
password
booked_courses
*/
const mongoose = require("mongoose");

const user_schema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    birth_date: Date,
    username: String,
    password: String,
    booked_courses: [mongoose.Schema.Types.ObjectId]
},{collection: 'authenticated_user'});

module.exports = mongoose.model("AuthenticatedUser", user_schema);