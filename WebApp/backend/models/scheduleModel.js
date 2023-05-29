const mongoose = require('mongoose')

const Schema = mongoose.Schema

const scheduleSchema = new Schema({
    tutorialsArray: [{
        day: Number,
        slot: Number,
        courseCode: String,
        tutorialGroup: Number,
        assignedTA: String

    }]

}, { timestamps: true })

module.exports = mongoose.model('scheduleModel', scheduleSchema, 'schedules')