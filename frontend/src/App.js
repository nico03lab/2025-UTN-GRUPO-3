import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { InscripcionPage } from "./pages/InscripcionPage";
import TeacherDashboard from "./components/TeacherDashboard";
import { EstudiantesPage } from "./pages/EstudiantesPage";
import DirectivoDashboard from "./components/DirectivoDashboard";
import { AlumnosPage } from "./pages/AlumnosPage";
import { ThemeProvider } from "./components/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route
          path="/inscripcion"
          element={<InscripcionPage></InscripcionPage>}
        ></Route>
        <Route path="/docente" element={<TeacherDashboard />}></Route>
        <Route path="/tutores" element={<EstudiantesPage />}></Route>
        <Route path="/alumnos" element={<AlumnosPage />}></Route>
        <Route path="/directivos" element={<DirectivoDashboard />}></Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;