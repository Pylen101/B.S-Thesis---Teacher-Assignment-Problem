import { createContext, useReducer } from 'react'

export const UserContext = createContext()

export const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                user: action.payload
            }
        case 'GET_USER':
            return {
                user: action.payload
            }
        case 'UPDATE_USER':
            return {
                user: action.payload
            }
        default:
            return state
    }
}

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, {
        user: null
    })

    return (
        <UserContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UserContext.Provider>
    )
}