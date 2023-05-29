import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AdminDetails from '../components/AdminDetails';
import Header from '../components/Header';
import AdminForm from '../components/AdminForm';
import { useTeacherAssistantsContext } from '../hooks/useTeacherAssistantsContext';
import { useAuthContext } from '../hooks/hook';
const ManageAdmins = () => {
    const [search, setSearch] = useState(false)
    const [name, setName] = useState('')
    const { userIn } = useAuthContext();
    const { teacherAssistants, dispatch } = useTeacherAssistantsContext();

    const handleSearch = async (name) => {
        const input = { name }

        const res = await fetch('/users/findAdmin/' + userIn,
            {
                method: 'POST',
                body: JSON.stringify(input),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(name)
        const data = await res.json();

        if (res.ok) {
            console.log(data)
            dispatch({ type: 'SEARCH_TEACHER_ASSISTANT', payload: data })
            //console.log("TEACHER ASSISTANTS")
            //console.log(teacherAssistants)
        }
    }
    useEffect(() => {
        const fetchTeacherAssistants = async () => {

            const res = await fetch('/users/getAllAdmins/' + userIn,
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
                console.log(data)
                dispatch({ type: 'SET_TEACHER_ASSISTANTS', payload: data })
            }


        }
        console.log("ENTERED")
        if (search == false)
            fetchTeacherAssistants();


    }, [])

    return (
        <div>
            <Navbar />
            <Header />
            <div className='pages'>

                <div className='manageTeacherAssistants' >
                    <div className='teacherAssistants' >
                        <div className='buttonIn'>
                            <input
                                className='input-field'
                                placeholder='Search by First name or Last name'
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <button className='input-button' onClick={() => { handleSearch(name) }}>Search</button>
                        </div>
                        {(!teacherAssistants || teacherAssistants.length == 0) ? <label className='teacherassistant-details'>No Other admins have been added yet</label> : teacherAssistants.map((admin) => (
                            <AdminDetails key={admin._id} admin={admin} />
                        ))}
                    </div>

                    <AdminForm />



                </div>
            </div>
        </div>
    )
}

export default ManageAdmins;