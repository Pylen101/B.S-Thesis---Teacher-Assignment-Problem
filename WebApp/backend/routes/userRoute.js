const express = require('express')
const {
    signupUser,
    loginUser,
    addNewUser,
    getAllTAs,
    deleteTA
} = require('../controllers/userController')


const router = express.Router()
// signup Route
router.post('/signup', signupUser)

// login Route
router.post('/login', loginUser)

// add a new user
router.post('/addNewUser', addNewUser)

// get all teacherAssistants
router.get('/getAllTAs', getAllTAs)

// delete a TA
router.delete('/deleteTA/:id', deleteTA)

// Logout Route
router.get('/logout', (req, res) => {
    res.send('logout')
}
)

module.exports = router

