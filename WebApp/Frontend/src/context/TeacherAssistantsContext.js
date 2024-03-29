import { createContext, useReducer } from 'react'

export const TeacherAssistantsContext = createContext()

export const teacherAssistantsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TEACHER_ASSISTANTS':
            return {
                teacherAssistants: action.payload
            }
        case 'ADD_TEACHER_ASSISTANT':
            return {
                teacherAssistants: [action.payload, ...state.teacherAssistants]
            }
        case 'DELETE_TEACHER_ASSISTANT':
            return {
                teacherAssistants: state.teacherAssistants.filter((teacherAssistant) => teacherAssistant._id !== action.payload._id)
            }
        case 'SEARCH_TEACHER_ASSISTANT':
            console.log(action.payload.name)
            return {
                teacherAssistants: action.payload
            }
        case 'UPDATE_TEACHER_ASSISTANT':
            return {
                teacherAssistants: state.teacherAssistants.map((teacherAssistant) => teacherAssistant._id === action.payload._id ? action.payload : teacherAssistant)
            }
        default:
            return state
    }
}

export const TeacherAssistantsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(teacherAssistantsReducer, {
        teacherAssistants: null
    })

    return (
        <TeacherAssistantsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TeacherAssistantsContext.Provider>
    )
}