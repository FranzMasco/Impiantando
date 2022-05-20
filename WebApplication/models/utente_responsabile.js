const mongoose = require("mongoose");

const responsabile_schema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    birth_date: Date,
    username: String,
    password: String,
    company: String
},{collection: 'utente_responsabile'});

module.exports = mongoose.model("ResponsabileUser", responsabile_schema);