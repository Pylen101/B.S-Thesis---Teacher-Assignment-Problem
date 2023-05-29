import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminHome from './pages/AdminHome';
import ManageTeacherAssistants from './pages/ManageTeacherAssistants';
import ManageAdmins from './pages/ManageAdmins';
import AssignTeacherAssistants from './pages/AssignTeacherAssistants';
import TeacherAssistantHome from './pages/TeacherAssitantHome';
import TeacherAssistantProfile from './pages/TeacherAssistantProfile';
import ViewAllSchedulesAdmin from './pages/ViewAllSchedulesAdmin';
import ViewAllSchedulesTA from './pages/ViewAllSchedulesTA';
import Login from './pages/login';
import Navbar from './components/Navbar';
import Header from './components/Header';


function App() {
  return (
    <div className="App">

      <BrowserRouter>



        <div >

          <Routes>

            <Route>
              <Route path='/admin' element={<AdminHome />} />

              <Route path='/admin/manageTeacherAssistants' element={<ManageTeacherAssistants />} />
              <Route path='/admin/manageAdmins' element={<ManageAdmins />} />
              <Route path='/admin/assignTeacherAssistants' element={<AssignTeacherAssistants />} />
              <Route path='/admin/viewAllSchedulesAdmin' element={<ViewAllSchedulesAdmin />} />
              <Route path='/teacherAssistant/viewAllSchedulesTA' element={<ViewAllSchedulesTA />} />
              <Route path='/teacherAssistant' element={<TeacherAssistantHome />} />
              <Route path='/teacherAssistant/teacherAssistantProfile' element={<TeacherAssistantProfile />} />
              <Route path='/login' element={<Login />} />

            </Route>

          </Routes>
        </div>





      </BrowserRouter >

    </div >
  );
}

export default App;
