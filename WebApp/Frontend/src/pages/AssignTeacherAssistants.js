import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TADetails from '../components/TADetails';
import Header from '../components/Header';
import TAForm from '../components/TAForm';
import { Tooltip } from 'react-tooltip'
import { useTeacherAssistantsContext } from '../hooks/useTeacherAssistantsContext';
import { useScheduleContext } from '../hooks/useScheduleContext';
import { IconButton } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import { red } from '@mui/material/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'




const AssignTeacherAssistants = () => {
    const [assignedTAs, setAssignedTAs] = useState([])
    const [tutorialGroups, setTutorialGroups] = useState(1)
    const [tutorialGroupView, setTutorialGroupView] = useState(1)
    const [courses, setCourses] = useState(1)
    const [coursesView, setCoursesView] = useState(1)
    const [schedule, setSchedule] = useState(
        [[[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []]]
    )
    const [coursesList, setCoursesList] = useState([])
    const [outputRec, setOutputRec] = useState(false)
    const [outputSchedule, setOutputSchedule] = useState(
        [[[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []]]
    )
    const [dayOffSchedule, setDayOffSchedule] = useState([])
    const [outputTutorials, setOutputTutorials] = useState([])
    const { teacherAssistants, dispatch } = useTeacherAssistantsContext();
    const { Schedule, dispatchSchedule } = useScheduleContext();

    useEffect(() => {
        const fetchTeacherAssistants = async () => {

            const res = await fetch('/users/getAllTAs',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                }
            );
            const data = await res.json();

            if (res.ok) {
                //console.log(data)
                dispatch({ type: 'SET_TEACHER_ASSISTANTS', payload: data })
            }


        }
        //console.log("ENTERED")

        fetchTeacherAssistants();


    }, [])

    const addTA = async (e, index) => {
        e.preventDefault();
        const id = teacherAssistants[index]._id
        const name = teacherAssistants[index].firstName + " " + teacherAssistants[index].lastName
        const taCourses = JSON.parse(JSON.stringify(teacherAssistants[index].coursesTeaching))
        //console.log(taCourses)
        const dayOffPref = JSON.parse(JSON.stringify(teacherAssistants[index].dayOffPreference))
        //console.log(dayOffPref)
        const sessionsPerDay = JSON.parse(JSON.stringify(teacherAssistants[index].sessionNumPreference))
        //console.log(sessionsPerDay)


        var TA = assignedTAs.find((ta) => ta.id === id)
        //console.log(TA)
        if (TA == null) {
            setAssignedTAs([...assignedTAs, { id, name, taCourses, dayOffPref, sessionsPerDay }])
        } else {
            console.log("TA already added")
        }
        //console.log(assignedTAs)


        //setAssignedTAs([...assignedTAs, { id, name, taCourses, dayOffPref, sessionsPerDay }])
    }

    const removeTA = async (e, index) => {
        e.preventDefault();
        let temp = JSON.parse(JSON.stringify(assignedTAs))
        temp.splice(index, 1)
        setAssignedTAs(temp)
    }

    const setTutGrp = async (e) => {
        e.preventDefault();
        setTutorialGroupView(tutorialGroups)
        console.log(tutorialGroupView)
    }

    const setCour = async (e) => {
        e.preventDefault();
        setCoursesView(courses)
        console.log(coursesView)
    }

    const dayCase = (day) => {
        switch (day) {
            case 0:
                return "SAT"
            case 1:
                return "SUN"
            case 2:
                return "MON"
            case 3:
                return "TUE"
            case 4:
                return "WED"
            case 5:
                return "THU"
            default:
                return "ERROR"
        }
    }

    const addTutorialForm = (e, day, slot) => {
        e.preventDefault();
        let temp = JSON.parse(JSON.stringify(schedule))
        temp[day][slot].push({ courseCode: "", tutorialGroup: "" })
        console.log(temp[day][slot])
        setSchedule(temp)
    }

    const removeTutorialForm = (e, day, slot, index) => {
        e.preventDefault();
        let temp = JSON.parse(JSON.stringify(schedule))
        temp[day][slot].splice(index, 1)
        setSchedule(temp)
    }
    const setTutorialFormCourseCode = (e, day, slot, index) => {
        e.preventDefault();
        e.target.value = e.target.value.toUpperCase()
        let temp = JSON.parse(JSON.stringify(schedule))
        temp[day][slot][index].courseCode = e.target.value
        setSchedule(temp)
    }
    const setTutorialFormTutorialGroup = (e, day, slot, index) => {
        e.preventDefault();
        let temp = JSON.parse(JSON.stringify(schedule))
        temp[day][slot][index].tutorialGroup = e.target.value
        setSchedule(temp)
    }

    const handleSubmit = async (e) => {
        if (assignedTAs.length == 0) {
            alert("No Teacher Assistants have been Selected")
            return
        }
        e.preventDefault();
        let coursesArr = []
        // Collecting all unique courses
        for (let i = 0; i < assignedTAs.length; i++) {
            for (let j = 0; j < assignedTAs[i].taCourses.length; j++) {
                if (!coursesArr.includes(assignedTAs[i].taCourses[j].courseCode)) {
                    console.log(assignedTAs[i].taCourses[j].courseCode)
                    //console.log(coursesArr.includes(assignedTAs[i].taCourses[j].courseCode))
                    coursesArr.push(assignedTAs[i].taCourses[j].courseCode)
                    console.log(coursesArr)
                }
            }
        }
        setCoursesList(coursesArr)
        // Find Max number of tutorials from schedule
        let maxTutorials = 1
        for (let i = 0; i < schedule.length; i++) {
            for (let j = 0; j < schedule[i].length; j++) {
                for (let k = 0; k < schedule[i][j].length; k++) {
                    var tutGrpCount = parseInt(schedule[i][j][k].tutorialGroup)
                    if (tutGrpCount > maxTutorials)
                        maxTutorials = tutGrpCount + 1
                }

            }
        }
        setTutorialGroupView(maxTutorials)
        console.log("maxTutorials:", maxTutorials)

        let num_tas = assignedTAs.length
        let num_days = 6
        let num_slots = 5
        let num_courses = coursesArr.length
        let num_tutorialGroups = maxTutorials
        //setCoursesList(coursesArr)
        console.log("coursesArr:", coursesArr)

        // 5
        let taCourseAssignment = []
        for (let i = 0; i < assignedTAs.length; i++) {
            let temp = Array(coursesArr.length)
            for (let j = 0; j < coursesArr.length; j++) {
                for (let k = 0; k < assignedTAs[i].taCourses.length; k++)
                    if (coursesArr[j] == assignedTAs[i].taCourses[k].courseCode)
                        temp[j] = assignedTAs[i].taCourses[k].sessionNum
            }
            taCourseAssignment.push(temp)
        }
        for (let i = 0; i < taCourseAssignment.length; i++) {
            for (let j = 0; j < taCourseAssignment[i].length; j++) {
                if (taCourseAssignment[i][j] == null)
                    taCourseAssignment[i][j] = 0
            }
        }
        console.log("taCourseAssignment:", taCourseAssignment)

        // 6
        let taDayOffPreference = []
        for (let i = 0; i < assignedTAs.length; i++) {
            taDayOffPreference.push(assignedTAs[i].dayOffPref)
        }
        console.log("taDayOffPreference:", taDayOffPreference)
        // 7
        let sessionNumberPreference = []
        for (let i = 0; i < assignedTAs.length; i++) {
            sessionNumberPreference.push(assignedTAs[i].sessionsPerDay)
        }
        console.log("sessionNumberPreference:", sessionNumberPreference)
        // 8
        console.log("tutorialGroups:", num_tutorialGroups)
        let inputSchedule = new Array(6)
        // create input schedule and set it all to 0s
        for (let i = 0; i < 6; i++) {
            inputSchedule[i] = new Array(5)
            for (let j = 0; j < 5; j++) {
                inputSchedule[i][j] = new Array(coursesArr.length)
                // courseArr.length = num_courses
                for (let k = 0; k < inputSchedule[i][j].length; k++) {
                    inputSchedule[i][j][k] = new Array(num_tutorialGroups)
                    for (let l = 0; l < inputSchedule[i][j][k].length; l++) {
                        inputSchedule[i][j][k][l] = 0
                    }
                }
            }
        }
        // set input schedule to 1s where there are tutorials
        for (let i = 0; i < 6; i++) {
            //console.log("here")
            //days
            for (let j = 0; j < 5; j++) {
                //slots
                //console.log('here')
                for (let k = 0; k < inputSchedule[i][j].length; k++) {
                    //courses
                    for (let l = 0; l < inputSchedule[i][j][k].length; l++) {
                        //tutorial groups
                        for (let n = 0; n < schedule[i][j].length; n++) {
                            //loop through schedule and set inputSchedule to 1s where there are tutorials
                            //console.log(schedule[i][j][n].courseCode)
                            //console.log(coursesArr[k])
                            if (schedule[i][j][n].courseCode == coursesArr[k] && schedule[i][j][n].tutorialGroup == l) {
                                inputSchedule[i][j][k][l] = 1
                            }
                        }
                    }
                }
            }
        }

        console.log("InputSchedule:", inputSchedule)
        /*
        for let i = 0; i < schedule.length; i++) {
            for (let j = 0; j < schedule[i].length; j++) {
                for (let k = 0; k < schedule[i][j].length; k++) {
                    if (schedule[i][j][k].courseCode == "") {
        */
        let testSchedule = [
            // sat
            [[[1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
            ],
            // sun
            [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
            [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
            [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
            ],
            // mon
            [[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
            ],
            // tue
            [[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
            ],
            // wed
            [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
            [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
            [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
            ],
            // thu
            [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
            [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
            [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
            [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
            [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
            ],
        ]

        const response = await fetch(`/users/createSchedule`, {
            method: 'POST',
            body: JSON.stringify({ num_tas, num_days, num_slots, num_courses, num_tutorialGroups, taCourseAssignment, taDayOffPreference, sessionNumberPreference, inputSchedule }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        console.log(json)
        const output = JSON.parse(json.data)

        console.log(output)

        if (!response.ok) {
            console.log(json)
            alert(json.error);
        }
        if (response.ok) {
            if (output == "FAILURE") {
                alert("Schedule could not be created")
                return
            }
            else {
                //console.log(json)
                //console.log(json.data[0])
                setOutputRec(true)
                setOutputSchedule(output[0])
                setOutputTutorials(output[1])
                setDayOffSchedule(output[2])
                console.log(output[0])
                console.log(output[1])
                console.log(output[2])
                alert("Assignment was Successful")
            }
        }
    }

    const confirmSubmission = async (e) => {
        const confirmBox = window.confirm(
            "Confirm Schedule Creation?"
        )
        if (confirmBox === true) {
            e.preventDefault();
            // create schedule to be added to database
            let tutorialsArray = []
            for (let i = 0; i < outputSchedule.length; i++) {
                for (let j = 0; j < outputSchedule[i].length; j++) {
                    for (let k = 0; k < outputSchedule[i][j].length; k++) {
                        if (outputSchedule[i][j][k].length != 0) {
                            let tutorial = outputSchedule[i][j][k]
                            tutorialsArray.push({ day: i, slot: j, courseCode: coursesList[tutorial[0]], tutorialGroup: outputSchedule[i][j][k][1], assignedTA: assignedTAs[tutorial[2]].name })

                        }
                    }
                }
            }
            console.log(tutorialsArray)

            const responseOne = await fetch(`/users/addSchedule`, {
                method: 'POST',
                body: JSON.stringify({ tutorialsArray }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const jsonOne = await responseOne.json()
            console.log(jsonOne)
            if (!responseOne.ok) {
                console.log(jsonOne)
                alert("Schedule Could Not Be Created");
            }
            if (responseOne.ok) {
                dispatchSchedule({ type: 'ADD_SCHEDULE', payload: jsonOne })
                console.log(jsonOne)

            }

            let taTutorialAssignment = new Array(assignedTAs.length)
            for (let i = 0; i < assignedTAs.length; i++) {
                taTutorialAssignment[i] = []
                for (let j = 0; j < outputTutorials[i].length; j++) {
                    taTutorialAssignment[i].push({ day: outputTutorials[i][j][0], slot: outputTutorials[i][j][1], courseCode: coursesList[outputTutorials[i][j][2]], tutorialGroup: outputTutorials[i][j][3], assignedTA: assignedTAs[i].name })
                }
            }
            console.log(taTutorialAssignment)
            for (let i = 0; i < taTutorialAssignment.length; i++) {

                const tutorials = taTutorialAssignment[i]
                const daysOff = dayOffSchedule[i]
                console.log(assignedTAs[i].id)
                const responseTwo = await fetch(`/users/updateTutorials/` + assignedTAs[i].id, {
                    method: 'PATCH',

                    body: JSON.stringify({ tutorials, daysOff }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const jsonTwo = await responseTwo.json()
                console.log(jsonTwo)
                if (!responseTwo.ok) {
                    alert("Schedule Could Not Be Created");
                    alert(jsonTwo.error);
                }
                if (responseTwo.ok) {
                    dispatch({ type: 'UPDATE_TEACHER_ASSISTANT', payload: jsonTwo })
                }

            }
            alert("Schedule has been created and added to database")
        }
    }
    return (
        <div>
            <Navbar />
            <Header />
            <div className='pages'>

                <div className='assignTeacherAssistants' >
                    <div className='teacherAssistants' >
                        <div className='teacherassistant-details'>
                            <h2>Assign Teacher Assitant Form</h2>
                            {/*<label>Number of Tutorial Groups:</label>
                            <div className='buttonIn'>
                                <input className='input-field'
                                    placeholder='Input Tutorial Groups'
                                    type='Number'
                                    value={tutorialGroups}
                                    onChange={(e) => setTutorialGroups(e.target.value)}
                                    min="1"
                                    step="1"

                                />
                                <button className='input-button' onClick={(e) => { setTutGrp(e) }}>Set Tutorial Group</button>
    </div>*/}

                            <p></p>
                            <label>Teacher Assistants Table:</label>
                            <table>
                                <tr>
                                    <th>Teacher Assitant ID</th>
                                    <th>Teacher Assistant Name</th>
                                    <th >Course Teaching
                                    </th>
                                </tr>
                                {teacherAssistants && teacherAssistants.map((teacherAssistant, index) => (
                                    <tr>
                                        <td key={teacherAssistant._id + 0.1}>{teacherAssistant._id}</td>
                                        <td key={teacherAssistant._id + 0.2}>{teacherAssistant.firstName + " " + teacherAssistant.lastName}</td>
                                        <td key={teacherAssistant._id + 0.3}>{teacherAssistant.coursesTeaching.map((item, index) =>
                                            // output coursesTeaching in table
                                            <tr style={{
                                                backgroundColor: '#f2f2f2',
                                                border: '1px solid black',
                                                textAlign: 'center'
                                            }}>
                                                <td key={index + 0.1}>{"<" + item.courseCode + ">"}</td>
                                                <td key={index + 0.2}>{"<" + item.sessionNum + ">"}</td>
                                            </tr>
                                        )
                                        }</td>
                                        <td><button onClick={(e) => addTA(e, index)}>Add TA</button></td>
                                    </tr>
                                ))}

                            </table>
                            <p></p>


                        </div>
                        <div className='teacherassistant-details'> <h2>Data that has been Input:</h2>

                            <label><strong>Input Teacher Assistants:</strong></label>
                            {(!assignedTAs || assignedTAs.length == 0) ? (<label>No Teacher Assistants have been selected yet</label>) : <table>
                                <tr>
                                    <th>Teacher Assitant ID</th>
                                    <th>Teacher Assistant Name</th>
                                </tr>
                                {assignedTAs.map((assignedTA, index) => (
                                    <tr>
                                        <td key={assignedTA.id + 0.1}>{assignedTA.id}</td>
                                        <td key={assignedTA.id + 0.2}>{assignedTA.name}</td>
                                        <td><button onClick={(e) => { removeTA(e, index) }}>Remove TA</button></td>
                                    </tr>
                                ))}
                            </table>
                            }
                            <br></br>
                            <label style={{
                                textAlign: 'center',
                                backgroundColor: '#1aac83',
                                color: 'white',
                                width: '100%',
                                border: '1px solid black'
                            }}><strong>Input Schedule:</strong></label>
                            <table>
                                <th>Days</th>
                                <th>SLOT 1</th>
                                <th>SLOT 2</th>
                                <th>SLOT 3</th>
                                <th>SLOT 4</th>
                                <th>SLOT 5</th>
                                {
                                    outputSchedule && schedule.map((day, dayIndex) => (
                                        <tr>
                                            <td key={dayIndex + 0.1}>{dayCase(dayIndex)}</td>
                                            {day.map((slot, slotIndex) => (
                                                <td key={slotIndex + 0.2}>
                                                    {
                                                        <div
                                                        ><button onClick={(e) => addTutorialForm(e, dayIndex, slotIndex)}>Add Tutorial</button>{
                                                                slot.map((tutorial, index) => (
                                                                    <div className='tutorial-form'>
                                                                        <p></p>
                                                                        <label className='tutorial-form-label'>
                                                                            Tut: {index}
                                                                            <button className='tutorial-form-button' onClick={(e) => removeTutorialForm(e, dayIndex, slotIndex, index)}>
                                                                                <FontAwesomeIcon icon={faXmark} />
                                                                            </button>
                                                                        </label>
                                                                        <div>
                                                                            <div style={{
                                                                                transform: 'translate(5px, -5px)'
                                                                            }}>
                                                                                <input className='tutorial-form-input' onChange={(e) => { setTutorialFormCourseCode(e, dayIndex, slotIndex, index) }} type="text" value={tutorial.courseCode} placeholder="Course Code" />
                                                                                <input className='tutorial-form-input' onChange={(e) => { setTutorialFormTutorialGroup(e, dayIndex, slotIndex, index) }} type="text" value={tutorial.tutorialGroup} placeholder="TutorialGroup" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                }

                            </table>
                            <p></p>


                            <button className='AssignTA-button' onClick={(e) => handleSubmit(e)}>Assign Teacher Assistants to Schedule</button>


                        </div>
                        <div className='teacherassistant-details'>
                            <h2>Output Schedule</h2>
                            <label><strong>Max Tutorial Groups: </strong>{tutorialGroupView}</label>
                            <br></br>
                            <table>
                                <th>Days</th>
                                <th>SLOT 1</th>
                                <th>SLOT 2</th>
                                <th>SLOT 3</th>
                                <th>SLOT 4</th>
                                <th>SLOT 5</th>
                                {
                                    outputSchedule.map((day, dayIndex) => (
                                        <tr>
                                            <td key={dayIndex + 0.1}>{dayCase(dayIndex)}</td>
                                            {day.map((slot, slotIndex) => (
                                                <td key={slotIndex + 0.2}>
                                                    {
                                                        <div>{
                                                            slot.map((tutorial, index) => (
                                                                <div className='tutorial-form'>
                                                                    <p></p>
                                                                    <label className='tutorial-form-label'>Tut: {index}</label>
                                                                    <div>
                                                                        <div style={{
                                                                            transform: 'translate(5px, -5px)'
                                                                        }}>
                                                                            <label className='tutorial-label-output' type="text" >Course: <strong>{coursesList[tutorial[0]]}</strong></label>
                                                                            <label className='tutorial-label-output' type="text" >Tutorial Grp: <strong>{tutorial[1]}</strong></label>
                                                                            <label className='tutorial-label-output' type="text" >TA: <strong>{assignedTAs[tutorial[2]].name}</strong></label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                        </div>
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                }

                            </table>

                            {outputRec ? <button className='AssignTA-button' onClick={(e) => confirmSubmission(e)}>Confirm Submission</button> : ""}


                        </div>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default AssignTeacherAssistants;