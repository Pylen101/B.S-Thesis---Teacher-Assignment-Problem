import { useTeacherAssistantsContext } from "../hooks/useTeacherAssistantsContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';


const TADetails = ({ teacherAssistant }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [firstName, setFirstName] = useState(teacherAssistant.firstName);
    const [lastName, setLastName] = useState(teacherAssistant.lastName);
    const [email, setEmail] = useState(teacherAssistant.email);
    const [password, setPassword] = useState("ABCabc456!!");
    const [coursesTeaching, setCoursesTeaching] = useState([{ courseCode: "", sessionNum: "" }]);
    const { dispatch } = useTeacherAssistantsContext();


    const handleClick = () => {
        setCoursesTeaching([...coursesTeaching, { courseCode: "", sessionNum: "" }]);
    }

    const handleChange = (e, i) => {
        e.preventDefault()
        const { name, value } = e.target
        const onChangeVal = [...coursesTeaching]
        onChangeVal[i][name] = value
        setCoursesTeaching(onChangeVal)

    }
    const handleDelete = (i) => {
        const deleteVal = [...coursesTeaching]
        deleteVal.splice(i, 1)
        setCoursesTeaching(deleteVal)
    }

    function deleteButton(i) {
        if (i != 0) {
            return <button type='button' className='deleteButton' onClick={() => handleDelete(i)}>Delete Courses Fields</button>
        }

    }
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const HandleClick = async () => {
        const confirmBox = window.confirm(
            "Do you really want to delete this Teacher Assistant?"
        )
        if (confirmBox === true) {
            const res = await fetch('/users/deleteTA/' + teacherAssistant._id,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
            const json = await res.json();

            if (res.ok) {
                dispatch({ type: 'DELETE_TEACHER_ASSISTANT', payload: json })
                alert("Teacher Assistant Deleted Successfully")
            }
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        const TA = { firstName, lastName, email, password, coursesTeaching }
        console.log(firstName, lastName, email, password, coursesTeaching)
        console.log(teacherAssistant._id)
        const response = await fetch('/users/updateTA/' + teacherAssistant._id, {
            method: 'PATCH',
            body: JSON.stringify(TA),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();
        console.log(response.json);
        if (!response.ok) {
            alert("Error: " + json.error);
        }
        if (response.ok) {
            alert("Teacher Assistant Updated Successfully")
            setIsOpen(!isOpen);
            setCoursesTeaching([{ courseCode: "", sessionNum: "" }]);
            dispatch({ type: 'UPDATE_TEACHER_ASSISTANT', payload: json })
            console.log(json);
        }
    }


    return (

        <div className='teacherassistant-details' >
            <h2><strong> Teacher Assistant Name: </strong>{teacherAssistant.firstName + " " + teacherAssistant.lastName}</h2>
            <p><strong>Email: </strong>{teacherAssistant.email}</p>
            <p><strong>ID: </strong>{teacherAssistant._id}</p>
            <p><strong>Total Sessions: </strong>{teacherAssistant.totalSessions}</p>
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
                    {teacherAssistant.coursesTeaching.map((item, index) =>
                        // output coursesTeaching in table
                        <tr>

                            <td key={index + 0.1}>{item.courseCode}</td>
                            <td key={index + 0.2}>{item.sessionNum}</td>
                        </tr>
                    )
                    }
                    <tr>
                        <td>Total: </td>
                        <td>{teacherAssistant.totalSessions}</td>
                    </tr>
                </table>
            </table>

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
                    <td>{teacherAssistant.dayOffPreference[0]}</td>
                    <td>{teacherAssistant.dayOffPreference[1]}</td>
                    <td>{teacherAssistant.dayOffPreference[2]}</td>
                    <td>{teacherAssistant.dayOffPreference[3]}</td>
                    <td>{teacherAssistant.dayOffPreference[4]}</td>
                    <td>{teacherAssistant.dayOffPreference[5]}</td>
                </tr>
                <tr>
                    <td>Session Number Preference</td>
                    <td>{teacherAssistant.sessionNumPreference[0]}</td>
                    <td>{teacherAssistant.sessionNumPreference[1]}</td>
                    <td>{teacherAssistant.sessionNumPreference[2]}</td>
                    <td>{teacherAssistant.sessionNumPreference[3]}</td>
                    <td>{teacherAssistant.sessionNumPreference[4]}</td>
                    <td>{teacherAssistant.sessionNumPreference[5]}</td>
                </tr>
            </table >
            <span onClick={HandleClick}>delete<FontAwesomeIcon icon={faTrash} /></span>
            <button className="updateButtonToggle"
                type="button"
                value="Update Teacher Assistant"
                onClick={togglePopup}>Update Teacher Assistant Data</button>

            {isOpen ?
                <div>
                    <b>Fill The fields to update Data:</b>
                    <form>
                        <label>
                            First Name:
                            <input type="text" name="firstName"
                                defaultValue={firstName}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>
                        <label>
                            Last Name:
                            <input type="text" name="lastName"
                                defaultValue={lastName}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </label>
                        <label>
                            Email:
                            <input type="text" name="email"
                                defaultValue={email}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            Password:
                            <input type="text" name="password"
                                defaultValue={password}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <button className='coursesTeachingButton' onClick={handleClick} type='button'>Add More Fields for Courses</button>{
                            coursesTeaching.map((item, i) =>
                                <div>
                                    <label>Course {"  " + (i + 1)}</label>
                                    <input
                                        name="courseCode" type="text" value={item.courseCode} placeholder="Course Code" onChange={(e) => handleChange(e, i)} />
                                    <input
                                        name="sessionNum" type="number" value={item.sessionNum} placeholder="Session Number" onChange={(e) => handleChange(e, i)} />
                                    {deleteButton(i)}
                                </div>
                            )
                        }
                        <button className="updateFormButton" onClick={handleUpdate}>Submit Update Form</button>
                    </form>
                </div>

                : ""}
        </div >
    )
}

export default TADetails