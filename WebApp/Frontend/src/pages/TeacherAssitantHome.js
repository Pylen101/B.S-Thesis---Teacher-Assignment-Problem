import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import HeaderTA from "../components/HeaderTA"
const TeacherAssistantHome = () => {

    useEffect(() => {
    }, [])

    return (
        <div>
            <Navbar />
            <HeaderTA />
            <div className='pages'>
                <div className='teacherAssitantsProfile'>
                    <div className="teacherAssistantsProfileBody">
                        <h1>Welcome Instructor!</h1>
                        <h3>Please use the Menubar on the left to Navigate Through the Application</h3>
                        <p>If you want to indicate your preferences visit {"<My Profile>"}</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default TeacherAssistantHome;