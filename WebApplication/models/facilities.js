const mongoose = require("mongoose");

const facilities = mongoose.Schema({
    name: String,
    description: String,
    id_s_c: mongoose.Schema.Types.ObjectId,
},{collection: 'impianto'});

module.exports = mongoose.model("Facilities", facilities);