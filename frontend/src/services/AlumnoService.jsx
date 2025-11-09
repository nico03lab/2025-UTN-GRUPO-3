import axios from 'axios';

const API_URL = 'http://localhost:3002/api/alumnos';

const alumnoService = {
  // Obtener datos del alumno
  getAlumno: (idUsuario) => {
    return axios.get(`${API_URL}/user/${idUsuario}`);
  },

  // Obtener horarios del alumno
  getHorarios: (dniAlumno) => {
    return axios.get(`${API_URL}/estudiante/${dniAlumno}/horarios`);
  },

  // Obtener notas del alumno
  getNotas: (dniAlumno) => {
    return axios.get(`${API_URL}/estudiante/${dniAlumno}/notas`);
  },

  // Obtener inasistencias del alumno
  getInasistencias: (dniAlumno) => {
    return axios.get(`${API_URL}/estudiante/${dniAlumno}/inasistencias`);
  },

  // Actualizar datos del alumno
  updateAlumno: (idUsuario, datos) => {
    return axios.put(`${API_URL}/configuracion/user/${idUsuario}`, datos);
  },
};

export default alumnoService;