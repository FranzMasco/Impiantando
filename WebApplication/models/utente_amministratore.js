const mongoose = require("mongoose")

const schema = mongoose.Schema({
	_id: String,
	nome: String,
	cognome: String,
	email: String,
	data_di_nascita: Date,
	username: String,
	password: String,
	centro_sportivo: {
		id_centro_sportivo: String,
		nome: String,
		indirizzo: {
			citta: String,
			via: String,
			descrizione: String,
		}
	}
})

module.exports = mongoose.model("utente_amministratore", schema)