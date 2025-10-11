import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { InscripcionPage } from './pages/InscripcionPage';
import TeacherDashboard from './components/TeacherDashboard';
import { EstudiantesPage } from './pages/EstudiantesPage';
import DirectivoDashboard from './components/DirectivoDashboard';

function App() {
  return (
   <Routes>
      <Route path="/" element={<HomePage></HomePage>}></Route>
      <Route path="/inscripcion" element={<InscripcionPage></InscripcionPage>}></Route>
      <Route path="/docente" element={<TeacherDashboard/>}></Route>
      <Route path="/estudiantes" element={<EstudiantesPage/>}></Route>
      <Route path="/directivos" element={<DirectivoDashboard/>}></Route>
    </Routes>
  );
}

export default App;