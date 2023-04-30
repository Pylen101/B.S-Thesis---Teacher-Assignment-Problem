import Course from '../models/courseModel.js'

// get all workouts
export const getCourses = async (req, res) => {
    const courses = await Course.find({}).sort({ createdAt: -1 })

    res.status(200).json(courses)
}

// get a single workout
export const getCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' })
    }

    const workout = await Course.findById(id)

    if (!workout) {
        return res.status(404).json({ error: 'No such workout' })
    }

    res.status(200).json(workout)
}

// create a new workout
export const createCourse = async (req, res) => {
    const { title, load, reps } = req.body

    // add to the database
    try {
        const workout = await Course.create({ title, load, reps })
        res.status(200).json(workout)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a workout
export const deleteCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such workout' })
    }

    const workout = await Course.findOneAndDelete({ _id: id })

    if (!workout) {
        return res.status(400).json({ error: 'No such workout' })
    }

    res.status(200).json(workout)
}

// update a workout
export const updateCourse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such workout' })
    }

    const workout = await Course.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!workout) {
        return res.status(400).json({ error: 'No such workout' })
    }

    res.status(200).json(workout)
}

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse
}