//News mongoose model
//Structure:
/*
_id : entity identifier
text
course_id
pubblication_date
*/

const mongoose = require("mongoose");

const news_schema = mongoose.Schema({
    text: String,
    course_id: String,
    pubblication_date: {type: Date, default: Date.now}
},{collection: 'news'});

module.exports = mongoose.model("News", news_schema);