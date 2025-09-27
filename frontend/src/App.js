import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { InscripcionPage } from './pages/InscripcionPage';
import TeacherDashboard from './components/TeacherDashboard';
import { EstudiantesPage } from './pages/EstudiantesPage';
import Solicitudes from './pages/solicitudes';

function App() {
  return (
   <Routes>
      <Route path="/" element={<HomePage></HomePage>}></Route>
      <Route path="/inscripcion" element={<InscripcionPage></InscripcionPage>}></Route>
      <Route path="/docente" element={<TeacherDashboard/>}></Route>
      <Route path='/solicitudes' element={<Solicitudes/>}></Route>
      <Route path="/estudiantes" element={<EstudiantesPage/>}></Route>
    </Routes>
  );
}

export default App;