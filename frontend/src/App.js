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
import { ProtectedRoute } from "./components/ProtectedRoute"

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
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/inscripcion" element={<InscripcionPage />} />

          {/*Grupo de rutas protegidas */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["docente", "padre", "estudiante", "directivo"]}
              />
            }
          >
            <Route path="/docente" element={<TeacherDashboard />} />
            <Route path="/tutores" element={<EstudiantesDashboard />} />
            <Route path="/alumnos" element={<AlumnosPage />} />
            <Route path="/directivos" element={<DirectivoDashboard />} />
          </Route>
        </Routes>
        {/*Global Toast visible para toda la app */}
        <div id="toast" className="toast toast-top toast-end hidden z-50">
          <div id="toast-alert" className="alert">
            <span id="toast-msg">Mensaje</span>
          </div>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
