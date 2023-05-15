import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TeacherAssistantsContextProvider } from './context/TeacherAssistantsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TeacherAssistantsContextProvider>
      <App />
    </TeacherAssistantsContextProvider>
  </React.StrictMode>
);


