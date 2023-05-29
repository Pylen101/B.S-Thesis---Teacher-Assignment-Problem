import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Header from "../components/Header"
const AdminHome = () => {

    useEffect(() => {
    }, [])

    return (
        <div>
            <Navbar />
            <Header />
            <div className='pages'>
                <div className='teacherAssitantsProfile'>
                    <div className="teacherAssistantsProfileBody">
                        <h1>Welcome Admin!</h1>
                        <h3>Please use the Menubar on the left to Navigate Through the Application</h3>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AdminHome;