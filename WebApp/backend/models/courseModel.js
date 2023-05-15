const mongoose = require('mongoose')

const Schema = mongoose.Schema

const courseSchema = new Schema({
    courseName: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    courseDescription: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('courseModel', courseSchema, 'courses')