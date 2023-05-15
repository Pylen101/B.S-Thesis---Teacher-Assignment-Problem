import { useEffect } from 'react';
import TADetails from '../components/TADetails';
import Header from '../components/Header';
import TAForm from '../components/TAForm';
import { useTeacherAssistantsContext } from '../hooks/useTeacherAssistantsContext';
const ManageTeacherAssistants = () => {
    const { teacherAssistants, dispatch } = useTeacherAssistantsContext();

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
                console.log(data)
                dispatch({ type: 'SET_TEACHER_ASSISTANTS', payload: data })
            }

        }

        fetchTeacherAssistants();

    }, [])

    return (

        <div className='manageTeacherAssistants' >


            <div className='teacherAssistants' >
                {teacherAssistants && teacherAssistants.map((teacherAssistant) => (
                    <TADetails key={teacherAssistant._id} teacherAssistant={teacherAssistant} />
                ))}
            </div>

            <TAForm />



        </div>
    )
}

export default ManageTeacherAssistants;