import { useContext } from "react";
import { ScheduleContext } from "../context/ScheduleContext.js";
export const useScheduleContext = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw Error('usecontext must be used inside provider');
    }
    return context;
}
export default useScheduleContext;