//Course mongoose model
//Structure:
/*
_id : entity identifier
name
description
sport
sport_facility_id: one-to-many relationship
                    each courses has one sport facility
                    each sport facility has one or more courses
managers: many-to-many relationship
        each manager has one or more courses
        each course has one or more managers
reviews
periodic: Boolean, //Se 0 si ripete una sola volta, se 1 si ripete periodicamente
specific_date
specific_start_time
specific_end_time
start_date
end_date
time_schedules:{
    monday: {event:[{from, to}]},
    tuesday: {event:[{from, to}]},
    wednesday: {event:[{from, to}]},
    thursday: {event:[{from, to}]},
    friday: {event:[{from, to}]},
    saturday: {event:[{from, to}]},
    sunday: {event:[{from, to}]}
}
exceptions
creation_date
*/

const mongoose = require("mongoose");

const course_schema = mongoose.Schema({
    name: String,
    description: String,
    sport: String,
    sport_facility_id: mongoose.Schema.Types.ObjectId,
    sport_center_id: mongoose.Schema.Types.ObjectId,
    managers: [mongoose.Schema.Types.ObjectId],
    reviews: [{_id: false, date: Date, vote: Number}],
    periodic: Boolean, //Se 0 si ripete una sola volta, se 1 si ripete periodicamente
    specific_date: {type: Date, default: '0000-00-00'},
    specific_start_time: String, //Only 4 character: 2 for hours, 2 for minutes
    specific_end_time: String,
    start_date: {type: Date, default: '0000-00-00'},
    end_date: {type: Date, default: '0000-00-00'},
    time_schedules:{
        monday: {event:[{_id: false, from: String, to: String}]},
        tuesday: {event:[{_id: false, from: String, to: String}]},
        wednesday: {event:[{_id: false, from: String, to: String}]},
        thursday: {event:[{_id: false, from: String, to: String}]},
        friday: {event:[{_id: false, from: String, to: String}]},
        saturday: {event:[{_id: false, from: String, to: String}]},
        sunday: {event:[{_id: false, from: String, to: String}]}
    },
    exceptions: [Date],
    creation_date: {type: Date, default: Date.now}
},{collection: 'course'});



module.exports = mongoose.model("Course", course_schema);