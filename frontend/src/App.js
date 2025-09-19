import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AsistenciaPage from './pages/AsistenciaPage'; // tu page

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal, mantiene tu layout por defecto */}
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <Link to="/asistencia">
                  <button className="App-link bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded">
                    Ir a Asistencias
                  </button>
                </Link>
              </header>
            </div>
          }
        />

        {/* Ruta de tu page de asistencia */}
        <Route path="/asistencia" element={<AsistenciaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
