import { json } from "react-router-dom";
import { useTeacherAssistantsContext } from "../hooks/useTeacherAssistantsContext";

const TADetails = ({ teacherAssistant }) => {
    const { dispatch } = useTeacherAssistantsContext();

    const HandleClick = async () => {
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
        }
    }


    return (

        <div className='teacherassistant-details' >
            <h2><strong> Teacher Assistant Name: </strong>{teacherAssistant.firstName + " " + teacherAssistant.lastName}</h2>
            <p><strong>Email: </strong>{teacherAssistant.email}</p>
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

                            <td key={index}>{item.courseCode}</td>
                            <td key={index}>{item.sessionNum}</td>
                        </tr>
                    )
                    }
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
            <span onClick={HandleClick}>delete</span>
        </div >
    )
}

export default TADetails