import mongoose from 'mongoose'

const Schema = mongoose.Schema

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('course', courseSchema)