import { useContext } from "react";
import { Context } from "../context/context.js";


export const useAuthContext = () => {
    const context = useContext(Context)

    if (!context) {
        throw Error('usecontext must be used inside provider')
    }

    return context

}
export default useAuthContext