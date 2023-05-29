import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthContext from "../hooks/hook.js";

const Login = () => {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { dispatch } = useAuthContext()
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault()

        const user = { email, password }

        const response = await fetch(`/users/login`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            console.log(json)
            alert(json.error);
        }
        if (response.ok) {
            console.log("response is ok")
            console.log(json)
            setEmail('')

            setPassword('')


            localStorage.setItem('user', json.token)
            dispatch({ type: 'LOGIN', payload: json.token })

            console.log("userRole is" + json.role)
            if (json.role == 'teacherAssistant') {

                navigate('/teacherAssistant');
            } else if (json.role == 'administrator') {
                navigate('/admin');
            }
        }


    }

    return (
        <div className="login">
            <div className="loginForm">
                <form className="create" onSubmit={handleSubmit}>
                    <h3>Please Login With Your Credentials</h3>


                    <label>Username: </label>
                    <input
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />

                    <label>Password: </label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    <button>Sign in</button>
                    <br></br>

                </form>
            </div>
        </div>
    )



}
export default Login