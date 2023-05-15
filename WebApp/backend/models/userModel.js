const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: { unique: true },
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    userRole: {
        type: String,
        required: true,
        enum: ['teacherAssistant', 'administrator']
    },
    totalSessions: {
        type: Number,
        required: true,
        default: 0
    },
    coursesTeaching: [
        {
            courseCode: String,
            sessionNum: Number
        }
    ],
    dayOffPreference: {
        type: [Number],
        required: true,
        default: [1, 2, 3, 4, 5, 6]
    },
    sessionNumPreference: {
        type: [Number],
        required: true,
        default: [4, 4, 4, 4, 4, 4]
    },
    // tutorials array
    assignedTutorials: [
        {
            type: Schema.Types.ObjectId,
            ref: 'tutorial'
        }
    ],
    // schedule
    assignedSchedule: {
        type: Schema.Types.ObjectId,
        ref: 'schedule',
        default: null
    }

}, { timestamps: true })


module.exports = mongoose.model('userModel', userSchema, 'users')