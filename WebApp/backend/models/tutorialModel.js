const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tutorialSchema = new Schema({
    Day: {
        type: String,
        required: true
    },
    slot: {
        type: Number,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    tutorialGroup: {
        type: Number,
        required: true
    },
    assignedTA: {
        type: String,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('tutorialModel', tutorialSchema, 'tutorials')