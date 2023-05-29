import HeaderTA from '../components/HeaderTA';
import TAForm from '../components/TAForm';
import Navbar from '../components/Navbar';
import { useUserContext } from '../hooks/useUserContext';
import { useAuthContext } from "../hooks/hook.js"



import { useEffect, useState } from "react"

const TeacherAssistantProfile = () => {
    const { userIn } = useAuthContext();
    const { user, dispatch } = useUserContext();
    const [isChanged, setIsChanged] = useState(false)
    const [prefTable, setPrefTable] = useState([[0, 6], [1, 5], [2, 4], [3, 3], [4, 2], [5, 1]])
    const [sessionTable, setSessionTable] = useState([[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4]])
    const [tutorialTable, setTutorialTable] = useState(
        [[[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []]]
    )
    const [dayOffTable, setDayOffTable] = useState([0, 0, 0, 0, 0, 0])
    //const [user, setUser] = useState({})
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('/users/getTA/' + userIn,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    credentials: 'include'
                }
            );
            const data = await res.json();
            const teacher = data.TA
            const schedule = data.tutorialSchedule
            setTutorialTable(schedule)

            if (res.ok) {

                dispatch({ type: 'GET_USER', payload: teacher })
            }
        }

        fetchUser();
        //console.log(userIn)
        handleTables()
        //console.log(user.assignedTutorials)



    }, [prefTable])

    const titleStyle = {
        color: "black",

    };

    const textStyle = {
        color: "1aac83",
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

    const handleUpClick = (index) => {
        if (index == 0)
            return
        let temp = prefTable.slice()
        let temp2 = temp[index][0]
        temp[index][0] = temp[index - 1][0]
        temp[index - 1][0] = temp2
        setPrefTable(temp)
    }

    const handleDownClick = (index) => {
        if (index == 5)
            return
        let temp = prefTable.slice()
        let temp2 = temp[index][0]
        temp[index][0] = temp[index + 1][0]
        temp[index + 1][0] = temp2
        setPrefTable(temp)
    }

    const handleSubmitDayOff = async (e) => {
        e.preventDefault();
        var arr = new Array(6)
        for (var i = 0; i < 6; i++) {
            let x = prefTable[i][0]
            arr[x] = prefTable[i][1]
        }
        console.log(arr)
        const input = { dayOffPreference: arr }
        const res = await fetch('/users/updateDayOffPreference/' + userIn,
            {
                method: 'PATCH',
                body: JSON.stringify(input),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            }
        );
        const data = await res.json();

        if (res.ok) {
            console.log(data)
            dispatch({ type: 'UPDATE_USER', payload: data })
            alert("Day Off Preference Updated")
        }
    }

    const changeIndex = (index, e) => {
        const { value } = e.target
        //console.log(value)
        //console.log("Before")
        //console.log(sessionTable)
        let temp = sessionTable.slice()
        temp[index][1] = parseInt(value)
        setSessionTable(temp)
        //console.log("After")
        //console.log(sessionTable)
    }


    const handleSubmitSessionNum = async (e) => {
        e.preventDefault();
        var arr = new Array(6)
        console.log(sessionTable)
        //console.log("Shartify")
        for (var i = 0; i < 6; i++) {
            arr[i] = sessionTable[i][1]
        }
        console.log(arr)
        let sum = 0
        for (var i = 0; i < 6; i++) {
            sum += arr[i]
        }
        if (sum < user.totalSessions) {
            alert("Please select at least a total of " + user.totalSessions + " sessions for fair distribution")
        }
        else {
            const input = { sessionNumPreference: arr }
            const res = await fetch('/users/updateSessionNumPreference/' + userIn,
                {
                    method: 'PATCH',
                    body: JSON.stringify(input),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                }
            );
            const data = await res.json();

            if (res.ok) {
                console.log(data)
                dispatch({ type: 'UPDATE_USER', payload: data })
                alert("Session Number Preference Updated")
            }
        }

    }
    const handleTables = () => {
        if (user && isChanged == false) {
            //let temp1 = user.assignedTutorials
            let temp2 = user.assignedDaysOff
            let dayOffSchedule = JSON.parse(JSON.stringify(dayOffTable))

            /*
            let tutSchedule = [[[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []]]
            for (var i = 0; i < temp1.length; i++) {
                let d = temp1[i].day
                let s = temp1[i].slot
                let courseCode = temp1[i].courseCode
                let tutorialGroup = temp1[i].tutorialGroup
                let assignedTA = temp1[i].assignedTA
                tutSchedule[d][s].push({ courseCode: courseCode, tutorialGroup: tutorialGroup, assignedTA: assignedTA })
            }
            */
            for (var i = 0; i < temp2.length; i++) {
                let day = temp2[i]
                dayOffSchedule[day] = 1
            }
            //setTutorialTable(tutSchedule)
            //console.log(tutSchedule)
            setDayOffTable(dayOffSchedule)
            console.log(dayOffSchedule)
            setIsChanged(true)
            return 1
        }

    }

    return (
        <div>
            <Navbar />
            <HeaderTA />
            <div className='pages'>

                <div className='teacherAssitantsProfile'>

                    <div className='teacherAssistantsProfileHeader'>
                        <h1> <span style={titleStyle}> Instructor Name: </span> <span style={textStyle}>{user ? "<" + user.firstName + " " + user.lastName + ">" : ""} </span></h1>
                        <p><span style={titleStyle}> Instructor Email: </span> <span style={textStyle}>{user ? "<" + user.email + ">" : ""} </span></p>
                    </div>
                    <div className='teacherAssistantsProfileBody'>
                        <h2>Instructor Data:</h2>


                        <p></p>
                        <table style={{
                            backgroundColor: '#f2f2f2',
                            border: '1px solid black',
                            textAlign: 'center'
                        }}>
                            <tr style={{
                                backgroundColor: '#f2f2f2',
                                border: '1px solid black',
                                textAlign: 'center'
                            }}>
                                Courses Assigned:</tr>
                            <table>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Session Number</th>
                                </tr>
                                {user && user.coursesTeaching.map((item, index) =>
                                    // output coursesTeaching in table
                                    <tr>

                                        <td key={index + 0.1}>{item.courseCode}</td>
                                        <td key={index + 0.2}>{item.sessionNum}</td>
                                    </tr>
                                )
                                }
                                <tr>
                                    <td>Total</td>
                                    <td>{user ? user.totalSessions : ""}</td>
                                </tr>
                            </table>
                        </table>
                        <p></p>

                        <p></p>
                        < table >
                            <tr>
                                <th>Days:</th>
                                <th>SAT</th>
                                <th>SUN</th>
                                <th>MON</th>
                                <th>TUE</th>
                                <th>WED</th>
                                <th>THU</th>
                            </tr>
                            <tr>
                                <td>Day Off Preference</td>
                                <td>{user ? user.dayOffPreference[0] : ""}</td>
                                <td>{user ? user.dayOffPreference[1] : ""}</td>
                                <td>{user ? user.dayOffPreference[2] : ""}</td>
                                <td>{user ? user.dayOffPreference[3] : ""}</td>
                                <td>{user ? user.dayOffPreference[4] : ""}</td>
                                <td>{user ? user.dayOffPreference[5] : ""}</td>
                            </tr>
                            <tr>
                                <td>Session Number Preference</td>
                                <td>{user ? user.sessionNumPreference[0] : ""}</td>
                                <td>{user ? user.sessionNumPreference[1] : ""}</td>
                                <td>{user ? user.sessionNumPreference[2] : ""}</td>
                                <td>{user ? user.sessionNumPreference[3] : ""}</td>
                                <td>{user ? user.sessionNumPreference[4] : ""}</td>
                                <td>{user ? user.sessionNumPreference[5] : ""}</td>
                            </tr>
                        </table >

                    </div>
                    <div className='teacherAssistantsProfileBody'>
                        <div className='displayTable'>
                            <h2>Assigned classes and Days Off</h2>
                            <label style={{
                                textAlign: 'center',
                                backgroundColor: '#1aac83',
                                color: 'white',
                                width: '100%',
                                border: '1px solid black'
                            }}><strong>Tutorial Schedule:</strong></label>
                            <table >
                                <tr>


                                    <th>Days</th>
                                    <th>SLOT 1</th>
                                    <th>SLOT 2</th>
                                    <th>SLOT 3</th>
                                    <th>SLOT 4</th>
                                    <th>SLOT 5</th>

                                </tr>
                                {
                                    user && tutorialTable.map((day, dayIndex) => (
                                        <tr>
                                            <td key={dayIndex + 0.1}>{dayCase(dayIndex)}</td>
                                            {day.map((slot, slotIndex) => (
                                                <td key={slotIndex + 0.2}>
                                                    {
                                                        <div>{
                                                            slot.map((tutorial, index) => (
                                                                <div className='tutorial-form'>
                                                                    <p></p>
                                                                    <label className='tutorial-form-label'>Tutorial</label>
                                                                    <div>
                                                                        <div style={{
                                                                            transform: 'translate(5px, -5px)'
                                                                        }}>
                                                                            <label className='tutorial-label-output' type="text" >Course: <strong>{tutorial.courseCode}</strong></label>
                                                                            <label className='tutorial-label-output' type="text" >Tutorial Grp: <strong>{tutorial.tutorialGroup}</strong></label>
                                                                            <label className='tutorial-label-output' type="text" >TA: <strong>{tutorial.assignedTA}</strong></label>
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
                            <br></br>
                            <label style={{
                                textAlign: 'center',
                                backgroundColor: '#1aac83',
                                color: 'white',
                                width: '100%',
                                border: '1px solid black'
                            }}><strong>Days Off</strong></label>
                            <table>
                                <tr>
                                    <th>Days</th>
                                    <th>SAT</th>
                                    <th>SUN</th>
                                    <th>MON</th>
                                    <th>TUE</th>
                                    <th>WED</th>
                                    <th>THU</th>
                                </tr>
                                <tr>
                                    <td>Day Off</td>
                                    <td>{dayOffTable[0] == 1 ? "Day Off" : ""}</td>
                                    <td>{dayOffTable[1] == 1 ? "Day Off" : ""}</td>
                                    <td>{dayOffTable[2] == 1 ? "Day Off" : ""}</td>
                                    <td>{dayOffTable[3] == 1 ? "Day Off" : ""}</td>
                                    <td>{dayOffTable[4] == 1 ? "Day Off" : ""}</td>
                                    <td>{dayOffTable[5] == 1 ? "Day Off" : ""}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div className='teacherAssistantsProfileBody'>
                        <h2>Update Day Off Preference Form:</h2>
                        <p> Rank your most prefered days from most prefered (priority 6) and least prefered (priority 1)
                        </p>

                        <table>
                            <tr>
                                <th> priority </th>
                                <th>Day</th>
                            </tr>
                            {
                                prefTable.map((item, index) =>
                                    <tr>
                                        <td>
                                            <button className='teacherAssistantsProfileBodyTableButton' onClick={() => handleUpClick(index)}>↑</button>
                                            <strong>{prefTable[index][1]}</strong>
                                            <button className='teacherAssistantsProfileBodyTableButton' onClick={() => handleDownClick(index)}>↓</button>
                                        </td>
                                        <td>{dayCase(item[0])}</td>
                                    </tr>
                                )
                            }
                        </table>
                        <form>
                            <button className='AssignTA-button' type='submit' onClick={handleSubmitDayOff}>Submit Day Off Pref</button>
                        </form>


                    </div>

                    <div className='teacherAssistantsProfileBody'>
                        <h2>Update Day Off Preference Form:</h2>
                        <p> Select the Maximum tutorials you would like each day</p>

                        <table>
                            <tr>
                                <th> Day </th>
                                <th>Session Number</th>
                            </tr>

                            {sessionTable.map((item, index) =>
                                <tr>
                                    <td>{dayCase(item[0])}</td>
                                    <td><select className='teacherAssistantsProfileBodyTableSelect' onChange={(e) => changeIndex(index, e)} defaultValue={4}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    </td>

                                </tr>
                            )}



                        </table>
                        <form>
                            <button className='AssignTA-button' type='submit' onClick={handleSubmitSessionNum}>Submit Session Pref</button>
                        </form>


                    </div>

                </div>
            </div>
        </div >
    );
}

export default TeacherAssistantProfile;