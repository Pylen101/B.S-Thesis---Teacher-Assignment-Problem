import { createContext, useReducer, useEffect } from "react";


export const Context = createContext()
export const contextReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            console.log(action.payload)
            return { userIn: action.payload }
        case 'LOGOUT':
            return { userIn: null }
        default:
            return state

    }



}
export const ContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(contextReducer, {
        userIn: null
    })
    useEffect(() => {
        const userIn = localStorage.getItem('userIn')

        if (userIn) {
            dispatch({ type: 'LOGIN', payload: userIn })
        }
    }, [])

    console.log(state)
    return (
        <Context.Provider value={{ ...state, dispatch }}>

            {children}
        </Context.Provider>
    )
}