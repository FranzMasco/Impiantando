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
*/
const mongoose = require("mongoose");

const manager_schema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    birth_date: Date,
    username: String,
    password: String,
    society: String
},{collection: 'manager_user'});

module.exports = mongoose.model("ManagerUser", manager_schema);