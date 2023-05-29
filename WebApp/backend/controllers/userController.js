const userModel = require('../models/userModel')
const scheduleModel = require('../models/scheduleModel')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')



const createToken = async (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}
// login user
const loginUser = async (req, res) => {
    email = req.body.email
    password = req.body.password

    try {
        var flage = ""
        if (!email || !password) {
            throw Error('All fields must be filled')
        }
        const user = await userModel.findOne({ email: email })
        if (!user) {
            throw Error('Incorrect email')
        }
        if (!user) {
            flage = { status: false, error: "no such user exists" }
            console.log("no user")
            result = flage
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw Error('Incorrect password')
        }
        if (match) {
            console.log("SUCCESS!")
            console.log(user._id)
            const token = user._id
            flage = { status: true, role: user.userRole, token: token }


        } else {
            console.log('wrong pass')
            flage = { status: false, error: "password is incorrect" }
        }
    }
    catch (error) {
        console.log("# error while Logging in the new user #" + "\n" + "# the error is => " + error.message + " #")
        flage = { status: false, error: error.message };

    }
    var result = flage

    if (result.status) {
        res.status(200).send(result)
        console.log('good')
    } else {

        res.status(400).send(result)
    }
}

// TA Functions

// fetch a TA by ID
const getTA = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such TA' })
    }

    const TA = await userModel.findById(id)
    let temp = TA.assignedTutorials
    let tutorialSchedule = [[[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []]]

    for (var i = 0; i < temp.length; i++) {
        let d = temp[i].day
        let s = temp[i].slot
        let courseCode = temp[i].courseCode
        let tutorialGroup = temp[i].tutorialGroup
        let assignedTA = temp[i].assignedTA
        tutorialSchedule[d][s].push({ courseCode: courseCode, tutorialGroup: tutorialGroup, assignedTA: assignedTA })
    }
    TA.assignedSchedule = tutorialSchedule

    if (!TA) {
        return res.status(404).json({ error: 'No such TA' })
    }
    const p = { TA, tutorialSchedule }

    res.status(200).json(p)
}
// update DayOffPreference
const updateDayOffPreference = async (req, res) => {
    const { id } = req.params
    const { dayOffPreference } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such TA' })
    }


    const TA = await userModel.findByIdAndUpdate(id, { dayOffPreference: dayOffPreference }, { new: true })

    if (!TA) {
        return res.status(404).json({ error: 'No such TA' })
    }

    res.status(200).json(TA)
}
const updateSessionNumPreference = async (req, res) => {
    const { id } = req.params
    const { sessionNumPreference } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such TA' })
    }


    const TA = await userModel.findByIdAndUpdate(id, { sessionNumPreference: sessionNumPreference }, { new: true })

    if (!TA) {
        return res.status(404).json({ error: 'No such TA' })
    }

    res.status(200).json(TA)
}
// Admin Functions

// Used to create initial admin account
const signupUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    try {

        if (!email || !password || !firstName || !lastName) {
            throw Error("all fields must be filled")
        }
        if (!validator.isEmail(email)) {
            throw Error("please insert a valid email")

        }

        //define info of new user
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
            userRole: "administrator",
        });

        //save new user to database
        await newUser.save().then(() => {
            res.status(200).json(newUser)
            console.log("# the new user has been saved successfully #")
        })
            .catch((error) => {
                console.log("# error while saving the new user #" + "\n" + "# the error is => " + error.message + " #")
            });
    } catch (error) {
        console.log("# error while saving the new user #" + "\n" + "# the error is => " + error.message + " #")
        res.status(400).json({ error: error.message })
    }

}


// Add a new TA
const addNewUser = async (req, res) => {
    const { firstName, lastName, email, password, coursesTeaching, dayOffPreference, sessionNumPreference
    } = req.body

    const ID = req.query.id

    let emptyFields = []
    if (!firstName) {
        emptyFields.push("firstName")
    }
    if (!lastName) {
        emptyFields.push("lastName")
    }
    if (!email) {
        emptyFields.push("email")
    }
    if (!password) {
        emptyFields.push("password")
    }
    for (let i = 0; i < coursesTeaching.length; i++) {
        if (!coursesTeaching[i].courseCode) {
            emptyFields.push("courseCode")
        }
        if (!coursesTeaching[i].sessionNum) {
            emptyFields.push("sessionNum")
        }
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill the fields', emptyFields })
    }

    // add to the database
    //check the user is admin or teacher assistant
    try {
        const admin = await userModel.findById(ID);

        // validation
        if (!validator.isEmail(email)) {
            throw Error('Email not valid')
        }
        if (!validator.isStrongPassword(password)) {

            throw Error('Password not strong enough')
        }

        const exists = await userModel.findOne({ email })

        if (exists) {
            throw Error('Email already in use')
        }
        console.log(admin.userRole);

        if (admin.userRole == "administrator" && admin.userRole != "teacherAssistant") {
            console.log("ENTERED");

            //define info of new user
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            var sum = 0;
            for (let i = 0; i < coursesTeaching.length; i++) {
                sum += parseInt(coursesTeaching[i].sessionNum);
                coursesTeaching[i].courseCode = coursesTeaching[i].courseCode.toUpperCase();
            }

            const newUser = new userModel({
                firstName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase(),
                email: email.toLowerCase(),
                password: hash,
                userRole: "teacherAssistant",
                totalSessions: sum,
                coursesTeaching: coursesTeaching,
                dayOffPreference: dayOffPreference,
                sessionNumPreference: sessionNumPreference
            });

            //save new user to database
            await newUser.save().then(() => {
                console.log("# the new user has been saved successfully #"),
                    res.status(200).json(newUser)
            })
                .catch((error) => {
                    console.log("# error while saving the new user #" + "\n" + "# the error is => " + error.message + " #")
                    res.status(400).json({ error: error.message })
                });
        }
    } catch (error) {
        console.log("# error while saving the new user #" + "\n" + "# the error is => " + error.message + " #")
        res.status(400).json({ error: error.message })
    }
}

// search for a TA based on email
const findTA = async (req, res) => {
    const { name } = req.body

    try {

        const TA = await userModel.find({
            $and: [{
                $or: [
                    { firstName: { $regex: name, $options: "i" } },
                    { lastName: { $regex: name, $options: "i" } },
                ]
            },
            { userRole: "teacherAssistant" }
            ]
        })
        res.status(200).json(TA)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateTA = async (req, res) => {
    const { id } = req.params
    const { firstName, lastName, email, password, coursesTeaching } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such TA' })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    var sum = 0;
    for (let i = 0; i < coursesTeaching.length; i++) {
        sum += parseInt(coursesTeaching[i].sessionNum);
        coursesTeaching[i].courseCode = coursesTeaching[i].courseCode.toUpperCase();
    }

    const TA = await userModel.findByIdAndUpdate(id, { firstName: firstName, lastName: lastName, email: email, password: hash, totalSessions: sum, coursesTeaching: coursesTeaching }, { new: true })

    if (!TA) {
        return res.status(404).json({ error: 'No such TA' })
    }

    res.status(200).json(TA)
}

// find admin
const findAdmin = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    try {

        const TA = await userModel.find({
            $and: [{
                $or: [
                    { firstName: { $regex: name, $options: "i" } },
                    { lastName: { $regex: name, $options: "i" } },
                ]
            },
            { userRole: "administrator" }, {
                _id: { $ne: id }
            }
            ]
        })
        res.status(200).json(TA)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// get all admins (not including yourself)
const getAllAdmins = async (req, res) => {
    const { id } = req.params
    try {
        const TAs = await userModel.find({
            $and: [{
                userRole: "administrator"
            }, {
                _id: { $ne: id }
            }
            ]
        }).sort({ createdAt: -1 })
        res.status(200).json(TAs)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// add a new admin
const addNewAdmin = async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    const ID = req.query.id

    let emptyFields = []
    if (!firstName) {
        emptyFields.push("firstName")
    }
    if (!lastName) {
        emptyFields.push("lastName")
    }
    if (!email) {
        emptyFields.push("email")
    }
    if (!password) {
        emptyFields.push("password")
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill the fields', emptyFields })
    }

    // add to the database
    //check the user is admin or teacher assistant
    try {
        const admin = await userModel.findById(ID);

        // validation
        if (!validator.isEmail(email)) {
            throw Error('Email not valid')
        }
        if (!validator.isStrongPassword(password)) {

            throw Error('Password not strong enough')
        }

        const exists = await userModel.findOne({ email })

        if (exists) {
            throw Error('Email already in use')
        }
        console.log(admin.userRole);

        if (admin.userRole == "administrator" && admin.userRole != "teacherAssistant") {
            console.log("ENTERED");

            //define info of new user
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            const newUser = new userModel({
                firstName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase(),
                email: email.toLowerCase(),
                password: hash,
                userRole: "administrator"
            });

            //save new user to database
            await newUser.save().then(() => {
                console.log("# the new user has been saved successfully #"),
                    res.status(200).json(newUser)
            })
                .catch((error) => {
                    console.log("# error while saving the new user #" + "\n" + "# the error is => " + error.message + " #")
                    res.status(400).json({ error: error.message })
                });
        }
    } catch (error) {
        console.log("# error while saving the new user #" + "\n" + "# the error is => " + error.message + " #")
        res.status(400).json({ error: error.message })
    }
}
// delete an Admin
const deleteAdmin = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such Teacher Assistant' })
    }
    const teacherAssistant = await userModel.findOneAndDelete({ _id: id })

    if (!teacherAssistant) {
        return res.status(400).json({ error: 'No such Teacher Assistant' })
    }

    res.status(200).json(teacherAssistant)
}

const updateAdmin = async (req, res) => {
    const { id } = req.params
    const { firstName, lastName, email, password } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Admin' })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const admin = await userModel.findByIdAndUpdate(id, { firstName: firstName, lastName: lastName, email: email, password: hash }, { new: true })

    if (!admin) {
        return res.status(404).json({ error: 'No such Admin' })
    }

    res.status(200).json(admin)
}

// fetch all teacherAssistants
const getAllTAs = async (req, res) => {
    try {
        const TAs = await userModel.find({ userRole: "teacherAssistant" }).sort({ createdAt: -1 })
        res.status(200).json(TAs)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// delete a TA
const deleteTA = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such Teacher Assistant' })
    }
    const teacherAssistant = await userModel.findOneAndDelete({ _id: id })

    if (!teacherAssistant) {
        return res.status(400).json({ error: 'No such Teacher Assistant' })
    }

    res.status(200).json(teacherAssistant)
}

// update tutorials and days off
const updateTutorials = async (req, res) => {
    const { id } = req.params
    const { tutorials, daysOff } = req.body
    // tutorials = [{day:2, slot:4, tutorialCode: "CSEN 702", tutorialGroup: "1", assignedTA: "ta 5"}.....]
    // daysOff = [1,2] --> array of 2 days off
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such TA' })
    }

    const TA = await userModel.findByIdAndUpdate(id, { assignedTutorials: tutorials, assignedDaysOff: daysOff }, { new: true })

    if (!TA) {
        return res.status(404).json({ error: 'No such TA' })
    }

    res.status(200).json(TA)
}








module.exports = {
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
    addNewAdmin,
    deleteAdmin,
    updateAdmin,
    findAdmin

}