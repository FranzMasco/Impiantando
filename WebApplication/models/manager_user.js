//Manager user mongoose model
//Structure:
/*
_id : entity identifier
name
surname
email
birth_date
username
password
society
courses: many-to-many relationship
        each manager has one or more courses
        each course has one or more managers
*/
const mongoose = require("mongoose");

const manager_schema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    birth_date: Date,
    username: String,
    password: String,
    society: String,
    courses: [mongoose.Schema.Types.ObjectId]
},{collection: 'manager_user'});

module.exports = mongoose.model("ManagerUser", manager_schema);