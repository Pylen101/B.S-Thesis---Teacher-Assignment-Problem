const Course = require('../models/courseModel')
const Schedule = require('../models/scheduleModel')
const mongoose = require('mongoose')
const { spawn } = require("child_process");

// get all schedules
const getAllSchedules = async (req, res) => {
    const schedules = await Schedule.find({}).sort({ createdAt: -1 })
    res.status(200).json(schedules)

}

// get a single schedule
const getSchedule = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such schedule' })
    }

    const schedule = await Schedule.findById(id)

    if (!schedule) {
        return res.status(404).json({ error: 'No such schedule' })
    }

    res.status(200).json(schedule)
}

// add new schedule
const addSchedule = async (req, res) => {
    const { tutorialsArray } = req.body

    try {
        const newSchedule = await Schedule.create({ tutorialsArray })
        res.status(201).json(newSchedule)

    } catch (error) {
        res.status(400).json({ error: error.message })


    }
}

// delete schedule
const deleteSchedule = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such schedule' })
    }

    const schedule = await Schedule.findOneAndDelete({ _id: id })

    if (!schedule) {
        return res.status(400).json({ error: 'No such schedule' })
    }

    res.status(200).json(schedule)
}



// create schedule
const createSchedule = async (req, res) => {


    const params = { num_tas, num_days, num_slots, num_courses, num_tutorialGroups, taCourseAssignment, taDayOffPreference, sessionNumberPreference, inputSchedule } = req.body
    //console.log(params)
    const arr = [num_tas, num_days, num_slots, num_courses, num_tutorialGroups, taCourseAssignment, taDayOffPreference, sessionNumberPreference, inputSchedule]
    console.log("I AM CREATING A SCHEDULE")
    const toolParams = JSON.stringify(arr)
    console.log(toolParams)
    const pythonProcess = spawn('python', ["model.py", toolParams], {});
    const stdout = [];
    // collect data from script
    const stderr = [];
    pythonProcess.stdout.on('data', (data) => stdout.push(data.toString()));
    pythonProcess.stderr.on('data', (data) => stderr.push(data.toString()));
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.log("ERROR")
            const errorMessage = stderr.join('');
            return errorMessage;
        }

        let pythonresult = stdout.join('');
        //console.log("Python result is: ", JSON.parse(pythonresult))
        return res.status(200).json({ success: true, data: pythonresult })
    });
}

module.exports = {
    getAllSchedules,
    getSchedule,
    createSchedule,
    addSchedule,
    deleteSchedule
}