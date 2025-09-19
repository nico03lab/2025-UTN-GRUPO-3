import React, { useEffect, useState } from "react";
import axios from "axios";

const AsistenciaForm = () => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [fechaHora, setFechaHora] = useState(new Date());

  // Actualiza fecha/hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Obtener cursos desde backend
  useEffect(() => {
    axios.get("http://localhost:3002/cursos")
      .then(res => setCursos(res.data))
      .catch(err => console.error(err));
  }, []);

  // Obtener alumnos del curso seleccionado
  useEffect(() => {
    if (selectedCurso) {
      axios.get(`http://localhost:3002/alumnos-por-curso/${selectedCurso}`)
        .then(res => {
          setAlumnos(res.data);
          const initAsistencia = {};
          res.data.forEach(a => initAsistencia[a.DNI] = false);
          setAsistencia(initAsistencia);
        })
        .catch(err => console.error(err));
    } else {
      setAlumnos([]);
      setAsistencia({});
    }
  }, [selectedCurso]);

  const handleCheckbox = (dni) => {
    setAsistencia(prev => ({ ...prev, [dni]: !prev[dni] }));
  };

  const guardarAsistencia = () => {
    const payload = {
      curso: selectedCurso,
      fecha: fechaHora.toISOString().split("T")[0],
      asistencia: Object.entries(asistencia).map(([DNI, Presente]) => ({ DNI, Presente: Presente ? 1 : 0 }))
    };
    axios.post("http://localhost:3002/asistencias", payload)
      .then(res => alert("Asistencia guardada ✅"))
      .catch(err => console.error(err));
  };

  return (
    <div>
      {/* Fecha y hora */}
      <div className="fecha-hora">{fechaHora.toLocaleString()}</div>

      {/* Select de cursos */}
      <select
        className="asistencia-select"
        value={selectedCurso}
        onChange={e => setSelectedCurso(e.target.value)}
      >
        <option value="">-- Elegir curso --</option>
        {cursos.map(c => (
          <option key={c.IdCurso} value={c.IdCurso}>{c.Nivel} - {c.IdCurso}</option>
        ))}
      </select>

      {/* Lista de alumnos */}
      {alumnos.length > 0 && (
        <div className="alumnos-list">
          {alumnos.map(a => (
            <div key={a.DNI} className="alumno-item">
              <span>{a.Apellido}, {a.Nombres}</span>
              <input
                type="checkbox"
                checked={asistencia[a.DNI] || false}
                onChange={() => handleCheckbox(a.DNI)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Botón guardar */}
      <button
        onClick={guardarAsistencia}
        className="guardar-btn"
        disabled={!selectedCurso}
      >
        Guardar Asistencia
      </button>
    </div>
  );
};

export default AsistenciaForm;
