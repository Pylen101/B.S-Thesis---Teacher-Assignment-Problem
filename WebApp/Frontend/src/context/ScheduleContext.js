import { createContext, useReducer } from 'react';

export const ScheduleContext = createContext();

export const scheduleContextReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SCHEDULES':
            return {
                schedules: action.payload

            };
        case 'ADD_SCHEDULE':
            return {
                schedules: [action.payload, ...state.schedules]
            };
        case 'DELETE_SCHEDULE':
            return {
                schedules: state.schedules.filter((schedule) => schedule._id !== action.payload._id)
            };
    }
}

export const ScheduleContextProvider = ({ children }) => {
    const [state, dispatchSchedule] = useReducer(scheduleContextReducer, {
        schedules: []
    });
    return (<ScheduleContext.Provider value={{ ...state, dispatchSchedule }}>
        {children}
    </ScheduleContext.Provider>);
}

