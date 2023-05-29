import { useTeacherAssistantsContext } from "../hooks/useTeacherAssistantsContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

const TADetails = ({ admin }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [firstName, setFirstName] = useState(admin.firstName);
    const [lastName, setLastName] = useState(admin.lastName);
    const [email, setEmail] = useState(admin.email);
    const [password, setPassword] = useState("ABCabc456!!");
    const { dispatch } = useTeacherAssistantsContext();

    const HandleClick = async () => {
        const confirmBox = window.confirm(
            "Do you really want to delete this Admin?"
        )
        if (confirmBox === true) {
            const res = await fetch('/users/deleteAdmin/' + admin._id,
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
                alert("Admin Deleted Successfully")
            }
        }
    }
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        const TA = { firstName, lastName, email, password }
        console.log(firstName, lastName, email, password)
        console.log(admin._id)
        const response = await fetch('/users/updateAdmin/' + admin._id, {
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
            alert("Admin Updated Successfully")
            setIsOpen(!isOpen);
            dispatch({ type: 'UPDATE_TEACHER_ASSISTANT', payload: json })
            console.log(json);
        }
    }


    return (

        <div className='teacherassistant-details' >
            <h2><strong> Admin Name: </strong>{admin.firstName + " " + admin.lastName}</h2>
            <p><strong>Email: </strong>{admin.email}</p>
            <p><strong>ID: </strong>{admin._id}</p>
            <p></p>
            <span onClick={HandleClick}>delete<FontAwesomeIcon icon={faTrash} /></span>
            <button className="updateButtonToggle"
                onClick={togglePopup}>Update Admin Data</button>

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
                        <button className="updateFormButton" onClick={handleUpdate}>Submit Update Form</button>
                    </form>
                </div>

                : ""}
        </div >
    )
}

export default TADetails