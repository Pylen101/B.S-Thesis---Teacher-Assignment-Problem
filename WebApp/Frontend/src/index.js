import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TeacherAssistantsContextProvider } from './context/TeacherAssistantsContext';
import { UserContextProvider } from './context/UserContext';
import { ContextProvider } from './context/context.js';
import { TutorialContextProvider } from './context/TutorialContext.js';
import { ScheduleContextProvider } from './context/ScheduleContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <TeacherAssistantsContextProvider>
        <UserContextProvider>
          <ScheduleContextProvider>
            <TutorialContextProvider>
              <App />
            </TutorialContextProvider>
          </ScheduleContextProvider>
        </UserContextProvider>
      </TeacherAssistantsContextProvider>
    </ContextProvider>
  </React.StrictMode>
);


