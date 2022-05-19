const mongoose = require("mongoose");

const facilities = mongoose.Schema({
    nome: String,
    descrizione: String,
},{collection: 'impianto'});

module.exports = mongoose.model("Facilities", facilities);