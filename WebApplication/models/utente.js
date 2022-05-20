const mongoose = require("mongoose")

const schema = mongoose.Schema({
	username: String,
    password: String
},{collection: 'utenti'})


module.exports = mongoose.model("Utente", schema)