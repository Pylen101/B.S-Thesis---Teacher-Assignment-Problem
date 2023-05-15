import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminHome from './pages/AdminHome';
import ManageTeacherAssistants from './pages/ManageTeacherAssistants';
import Navbar from './components/Navbar';
import Header from './components/Header';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Header />
        <div className='pages'>
          <Routes>
            <Route>
              <Route path='/admin' element={<AdminHome />} />
              <Route path='/admin/manageTeacherAssistants' element={<ManageTeacherAssistants />} />
            </Route>

          </Routes>

        </div>
      </BrowserRouter>

    </div>
  );
}

export default App;
