import { useContext } from 'react';
import { TeacherAssistantsContext } from '../context/TeacherAssistantsContext.js';

export const useTeacherAssistantsContext = () => {
    const context = useContext(TeacherAssistantsContext);
    if (!context) {
        throw new Error('useTeacherAssistantsContext must be used within a TeacherAssistantsContextProvider');
    }
    return context;
}