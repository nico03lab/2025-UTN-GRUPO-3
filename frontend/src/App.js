import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { InscripcionPage } from './pages/InscripcionPage';
import { AsistenciaPage } from './pages/AsistenciaPage';
import TeacherDashboard from './components/TeacherDashboard';
import Solicitudes from './pages/solicitudes';

function App() {
  return (
   <Routes>
      <Route path="/" element={<HomePage></HomePage>}></Route>
      <Route path="/asistencia" element={<AsistenciaPage></AsistenciaPage>}></Route>
      <Route path="/inscripcion" element={<InscripcionPage></InscripcionPage>}></Route>
      <Route path="/docente" element={<TeacherDashboard/>}></Route>
      <Route path='/solicitudes' element={<Solicitudes/>}></Route>
    </Routes>
  );
}

export default App;
