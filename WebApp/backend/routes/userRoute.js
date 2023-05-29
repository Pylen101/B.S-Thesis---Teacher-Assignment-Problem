const express = require('express')
const {
    signupUser,
    loginUser,
    addNewUser,
    getAllTAs,
    deleteTA,
    findTA,
    getTA,
    updateTA,
    updateDayOffPreference,
    updateSessionNumPreference,
    updateTutorials,
    getAllAdmins,
    deleteAdmin,
    updateAdmin,
    findAdmin,
    addNewAdmin
} = require('../controllers/userController')
const {
    getAllSchedules,
    getSchedule,
    createSchedule,
    deleteSchedule,
    addSchedule
} = require('../controllers/pyController')


const router = express.Router()
// signup Route
router.post('/signup', signupUser)

// login Route
router.post('/login', loginUser)

// add a new user
router.post('/addNewUser', addNewUser)

// update day off preference
router.patch('/updateDayOffPreference/:id', updateDayOffPreference)

// update session number preference
router.patch('/updateSessionNumPreference/:id', updateSessionNumPreference)

// get a TA
router.get('/getTA/:id', getTA)

// get all teacherAssistants
router.get('/getAllTAs', getAllTAs)

// delete a TA
router.delete('/deleteTA/:id', deleteTA)

// find a TA
router.post('/findTA', findTA)
// update a TA
router.patch('/updateTA/:id', updateTA)
// get all admins
router.get('/getAllAdmins/:id', getAllAdmins)
// delete an admin
router.delete('/deleteAdmin/:id', deleteAdmin)
// find an admin
router.post('/findAdmin/:id', findAdmin)
// add a new admin
router.post('/addNewAdmin', addNewAdmin)
// update an admin
router.patch('/updateAdmin/:id', updateAdmin)

// update tutorials and days off
router.patch('/updateTutorials/:id', updateTutorials)

// get all shcedules
router.get('/getAllSchedules', getAllSchedules)
// get a single schedule
router.get('/getSchedule/:id', getSchedule)
// create a schedule
router.post('/createSchedule', createSchedule)
// add a new Schedule
router.post('/addSchedule', addSchedule)
// delete a schedule
router.delete('/deleteSchedule/:id', deleteSchedule)


// Logout Route
router.get('/logout', (req, res) => {
    res.send('logout')
}
)

module.exports = router

