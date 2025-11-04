import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import Login from "./pages/Login";
import { InscripcionPage } from "./pages/InscripcionPage";
import TeacherDashboard from "./components/TeacherDashboard";
import { EstudiantesDashboard } from "./components/EstudiantesDashboard";
import DirectivoDashboard from "./components/DirectivoDashboard";
import { AlumnosPage } from "./pages/AlumnosPage";
import { ThemeProvider } from "./components/ThemeContext";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="light"
        />

        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route
            path="/inscripcion"
            element={<InscripcionPage></InscripcionPage>}
          ></Route>
          <Route path="/docente" element={<TeacherDashboard />}></Route>
          <Route path="/tutores" element={<EstudiantesDashboard />}></Route>
          <Route path="/alumnos" element={<AlumnosPage />}></Route>
          <Route path="/directivos" element={<DirectivoDashboard />}></Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
