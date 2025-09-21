import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { InscripcionPage } from './pages/InscripcionPage';
import { AsistenciaPage } from './pages/AsistenciaPage';

function App() {
  return (
   <Routes>
      <Route path="/" element={<HomePage></HomePage>}></Route>
      <Route path="/asistencia" element={<AsistenciaPage></AsistenciaPage>}></Route>
      <Route path="/inscripcion" element={<InscripcionPage></InscripcionPage>}></Route>
    </Routes>
  );
}

export default App;
