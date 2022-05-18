const mongoose = require("mongoose")

const schema = mongoose.Schema({
	nome: String,
    cognome: String
},{collection: 'utente_prova'})


module.exports = mongoose.model("utente_prova", schema)