const Course = require('../models/courseModel')
const mongoose = require('mongoose')

// get all Courses
const getCourses = async (req, res) => {
    const courses = await Course.find({}).sort({ createdAt: -1 })

    res.status(200).json(courses)
}

const getAssciatedCourses = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such course' })
    }

    const course = await Course.findById(id)

    if (!course) {
        return res.status(404).json({ error: 'No such course' })
    }

    res.status(200).json(course)
}


// get a single Course
const getCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such course' })
    }

    const course = await Course.findById(id)

    if (!course) {
        return res.status(404).json({ error: 'No such course' })
    }

    res.status(200).json(course)
}

// search for a course based on courseCode
const findCourse = async (req, res) => {
    const { courseCode } = req.params

    try {
        const course = await Course.find({ courseCode: { $regex: courseCode, $options: 'i' } })
        res.status(200).json(course)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// create a new Course
// NEEDS CHANGING
const createCourse = async (req, res) => {
    const { courseName, courseCode, courseDescription } = req.body

    let emptyFields = []
    if (!courseName) {
        emptyFields.push('courseName')
    }
    if (!courseCode) {
        emptyFields.push('courseCode')
    }
    if (!courseDescription) {
        emptyFields.push('courseDescription')
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in the following fields: ' + emptyFields })
    }

    // add to the database
    try {
        const course = await Course.create({ courseName, courseCode, courseDescription })
        res.status(200).json(course)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a Course
const deleteCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such course' })
    }

    const course = await Course.findOneAndDelete({ _id: id })

    if (!course) {
        return res.status(400).json({ error: 'No such course' })
    }

    res.status(200).json(course)
}

// update a Course
const updateCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such course' })
    }

    const course = await Course.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!course) {
        return res.status(400).json({ error: 'No such course' })
    }

    res.status(200).json(course)
}

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse,
    getAssciatedCourses
}