import { useState } from 'react';
import { useTeacherAssistantsContext } from '../hooks/useTeacherAssistantsContext';

const TAForm = () => {
    const { dispatch } = useTeacherAssistantsContext();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [coursesTeaching, setCoursesTeaching] = useState([{ courseCode: "", sessionNum: "" }]);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const TA = { firstName, lastName, email, password, coursesTeaching }

        const response = await fetch('/users/addNewUser?id=645c0db91efe4eca5cf8ac77', {
            method: 'POST',
            body: JSON.stringify(TA),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();
        console.log(response.json);
        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        }
        if (response.ok) {
            setError(null);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setCoursesTeaching([{ courseCode: "", sessionNumber: "" }]);
            setEmptyFields([]);
            dispatch({ type: 'ADD_TEACHER_ASSISTANT', payload: json })
            console.log(json);
        }
    }

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


    return (
        <div className='TAform'>
            <form className='create' onSubmit={handleSubmit}>
                <h3>Add a new Teacher Assistant</h3>
                <label>First Name:</label>
                <input
                    type='text'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={emptyFields.includes("firstName") ? "error" : ""}
                />
                <label>Last Name:</label>
                <input
                    type='text'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={emptyFields.includes("lastName") ? "error" : ""}
                />
                <label>Email:</label>
                <input
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={emptyFields.includes("email") ? "error" : ""}
                />
                <label>Password:</label>
                <input
                    type='text'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={emptyFields.includes("password") ? "error" : ""}
                />
                <button className='coursesTeachingButton' onClick={handleClick} type='button'>Add More Fields for Courses</button>{
                    coursesTeaching.map((item, i) =>
                        <div>
                            <label>Course {"  " + (i + 1)}</label>
                            <input className={emptyFields.includes("courseCode") ? "error" : ""}
                                name="courseCode" type="text" value={item.courseCode} placeholder="Course Code" onChange={(e) => handleChange(e, i)} />
                            <input className={emptyFields.includes("sessionNum") ? "error" : ""}
                                name="sessionNum" type="number" value={item.sessionNum} placeholder="Session Number" onChange={(e) => handleChange(e, i)} />
                            {deleteButton(i)}
                        </div>
                    )
                }
                <button onClick={handleSubmit} className='submitButton' type='submit'>Add Teacher Assistant</button>
                {
                    error && <div className="error">{error}</div>
                }

            </form>
        </div>


    )
}

export default TAForm