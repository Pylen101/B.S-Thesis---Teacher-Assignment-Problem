import { useState } from 'react';
import { useTeacherAssistantsContext } from '../hooks/useTeacherAssistantsContext';
import { useAuthContext } from '../hooks/hook';

const AdminForm = () => {
    const { dispatch } = useTeacherAssistantsContext();
    const { userIn } = useAuthContext();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const TA = { firstName, lastName, email, password }

        const response = await fetch('/users/addNewAdmin?id=' + userIn, {
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
            setError("");
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setEmptyFields([]);
            dispatch({ type: 'ADD_TEACHER_ASSISTANT', payload: json })
            console.log(json);
        }
    }

    return (
        <div className='TAform'>
            <form className='create' onSubmit={handleSubmit}>
                <h3>Add a new Admin</h3>
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
                <button onClick={handleSubmit} className='submitButton' type='submit'>Add Admin</button>
                {
                    error && <div className="error">{error}</div>
                }

            </form>
        </div>


    )
}

export default AdminForm