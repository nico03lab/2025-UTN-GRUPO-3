// src/services/DocenteService.js
import axios from "../services/axios";

const API_BASE_URL = "http://localhost:3002/api";

const docenteService = {
  // Obtener datos del docente
  async getDocente(idUsuario) {
    const res = await axios.get(`${API_BASE_URL}/docentes/${idUsuario}`);
    return res.data;
  },

  // Obtener cursos del docente
  async getCursos(dniDocente) {
    const res = await axios.get(`${API_BASE_URL}/cursos/${dniDocente}`);
    return res.data;
  },

  // Obtener alumnos de un curso
  async getAlumnos(idCurso) {
    const res = await axios.get(`${API_BASE_URL}/alumnos/${idCurso}`);
    return res.data;
  },

  // Obtener horarios del docente
  async getHorarios(dniDocente) {
    const res = await axios.get(`${API_BASE_URL}/docentes/horarios/${dniDocente}`);
    return res.data;
  },
};

export default docenteService;
