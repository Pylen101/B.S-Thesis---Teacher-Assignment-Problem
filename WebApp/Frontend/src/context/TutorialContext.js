import { createContext, useReducer } from 'react';
export const TutorialContext = createContext();
export const tutorialContextReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_TUTORIALS':
            return {
                tutorials: action.payload
            };
        default:
            return state;
    }
}
export const TutorialContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tutorialContextReducer, {
        tutorials: null
    });
    return (<TutorialContext.Provider value={{ ...state, dispatch }}>
        {children}
    </TutorialContext.Provider>);
};
