const mongoose = require("mongoose")

const schema = mongoose.Schema({
	username: String,
    password: String,
    courses: {
        course:[{name:String,description:String,course_id:mongoose.Schema.Types.ObjectId}]
    }
},{collection: 'utenti'})


module.exports = mongoose.model("Utente", schema)