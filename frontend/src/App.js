import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { InscripcionPage } from './pages/InscripcionPage';
import TeacherDashboard from './components/TeacherDashboard';
import { TutoresPage } from './pages/TutoresPage';
import DirectivoDashboard from './components/DirectivoDashboard';
import { AlumnosPage } from './pages/AlumnosPage';

function App() {
  return (
   <Routes>
      <Route path="/" element={<HomePage></HomePage>}></Route>
      <Route path="/inscripcion" element={<InscripcionPage></InscripcionPage>}></Route>
      <Route path="/docente" element={<TeacherDashboard/>}></Route>
      <Route path="/tutores" element={<TutoresPage/>}></Route>
      <Route path="/alumnos" element={<AlumnosPage/>}></Route>      
      <Route path="/directivos" element={<DirectivoDashboard/>}></Route>
    </Routes>
  );
}

export default App;