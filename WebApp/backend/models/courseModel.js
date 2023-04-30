import mongoose from 'mongoose'

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
    assignedTeacher: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('course', courseSchema)