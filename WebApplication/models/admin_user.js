//Admin user mongoose model
//Sructure:
/*
_id : entity identifier
name
surname
email
birth_date
username
password
sport_center : one-to-one relationship,
               each admin has one sport center
               each sport center belongs to one admin
  Sport center structure:
      _id : sport center identifiers
      name
      description
      address : {
          city
          location : for example via 4 Novembre
      }
*/

const mongoose = require("mongoose");

const sportCenter_schema = mongoose.Schema({
	name: String,
    description: String,
    address: {city: String, location: String}
});

const admin_schema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    birth_date: Date,
    username: String,
    password: String,
    sport_center: sportCenter_schema
},{collection: 'admin_user'});

module.exports = mongoose.model("AdminUser", admin_schema);