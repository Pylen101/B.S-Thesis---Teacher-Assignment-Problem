import express from 'express'
import courseCont from '../controllers/course.js'

const router = express.Router()

// GET all workouts
router.get('/', courseCont.getCourses)

// GET a single workout
router.get('/:id', courseCont.getCourse)

// POST a new workout
router.post('/', courseCont.createCourse)

// DELETE a workout
router.delete('/:id', courseCont.deleteCourse)

// UPDATE a workout
router.patch('/:id', courseCont.updateCourse)

module.exports = router