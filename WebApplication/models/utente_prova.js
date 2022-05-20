const mongoose = require("mongoose")

const schema = mongoose.Schema({
	username: String,
    password: String
},{collection: 'utente_prova'})


module.exports = mongoose.model("Utente_prova", schema)