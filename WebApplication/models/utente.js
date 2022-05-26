const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    birth_date: Date,
	username: String,
    password: String,
    courses: [mongoose.Schema.Types.ObjectId]
},{collection: 'utenti'})


module.exports = mongoose.model("Utente", schema)