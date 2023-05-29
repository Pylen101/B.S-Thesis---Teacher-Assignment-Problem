import { useState } from "react";

import useAuthContext from "./hook.js";


export const UseLogout = () => {

    const { dispatch } = useAuthContext()

    const [isLoading, setLoading] = useState(null)
    const logout = async () => {
        localStorage.removeItem('user')
        dispatch({ type: 'LOGOUT' })

    }
    return { logout, isLoading }
}
export default UseLogout