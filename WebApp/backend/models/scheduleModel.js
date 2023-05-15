const mongoose = require('mongoose')

const Schema = mongoose.Schema

const scheduleSchema = new Schema({
    tutorialsArray: [[[{
        type: Schema.Types.ObjectId,
        ref: 'tutorial'
    }]]]

}, { timestamps: true })

module.exports = mongoose.model('scheduleModel', scheduleSchema, 'schedules')