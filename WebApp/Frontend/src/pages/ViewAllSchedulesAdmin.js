import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Header from "../components/Header"
import useScheduleContext from "../hooks/useScheduleContext"
import ScheduleDetails from "../components/ScheduleDetails"
const ViewAllSchedulesAdmin = () => {
    const { schedules, dispatchSchedule } = useScheduleContext();
    const [tutorialTableView, setTutorialTableView] = useState(
        [[[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []]]
    )
    useEffect(() => {
        const fetchSchedule = async () => {
            const res = await fetch('/users/getAllSchedules',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    credentials: 'include'
                }
            )
            const data = await res.json()

            if (res.ok) {
                dispatchSchedule({ type: 'SET_SCHEDULES', payload: data })
                console.log(data)
                //console.log(schedule)
            }
        }
        fetchSchedule()
        //handleView()
    }, [])



    return (
        <div>
            <Navbar />
            <Header />
            <div className='pages'>
                <div className='teacherAssitantsProfile'>
                    <div className="teacherAssistantProfileHeader">

                    </div>


                    <div className="teacherAssistantProfileBody">

                        {
                            schedules && schedules.map((schedule) => (
                                <ScheduleDetails key={schedule._id} schedule={schedule} />

                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewAllSchedulesAdmin;