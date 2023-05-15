import { useEffect, useState } from "react"
const AdminHome = () => {

    useEffect(() => {
    }, [])

    return (
        <div>
            <h1>Welcome Admin!</h1>
            <button>Manage Teacher Assistants</button>
            <button>Manage Schedule</button>
            <button>Manage Courses</button>
        </div>
    );
}

export default AdminHome;