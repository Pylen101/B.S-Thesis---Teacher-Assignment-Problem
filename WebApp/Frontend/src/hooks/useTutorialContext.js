import { useContext } from "react";
import { TutorialContext } from "../context/TutorialContext.js";

export const useTutorialContext = () => {
    const context = useContext(TutorialContext);

    if (!context) {
        throw Error('usecontext must be used inside provider')
    }

    return context

}