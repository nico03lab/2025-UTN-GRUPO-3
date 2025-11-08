import axios from 'axios';

const API_URL = 'http://localhost:3002/api/alumnos';

const padreService = {
    getTutorByUser : async (idUsuario) => {
        const res = await axios.get(`http://localhost:3002/api/tutores/${idUsuario}`);
        return res.data;
      },

    //obtener al tutor
    getTutor: async (idUsuario) => {
        try{
            const response = await axios.get(`${API_URL}/tutor/${idUsuario}`);
            return response.data;
        }catch (error){
            throw error.response?.data || {message: 'Error al obtener al tutor'};
        }
    },
    
    // Obtener todos los hijos
    getHijos: async (padreId) => {
        try {
        const response = await axios.get(`${API_URL}/tutor/${padreId}/hijos`);
        return response.data;
        } catch (error) {
        throw error.response?.data || { message: 'Error al obtener hijos' };
        }
    },

    // Obtener información completa de un hijo
    getHijoCompleto: async (padreId, estudianteId) => {
        try {
        const response = await axios.get(`${API_URL}/tutor/${padreId}/estudiante/${estudianteId}`);
        return response.data;
        } catch (error) {
        throw error.response?.data || { message: 'Error al obtener información del estudiante' };
        }
    },

    // Obtener notas
    getNotas: async (estudianteId) => {
        try {
        const response = await axios.get(`${API_URL}/estudiante/${estudianteId}/notas`);
        return response.data;
        } catch (error) {
        throw error.response?.data || { message: 'Error al obtener notas' };
        }
    },

    // Obtener horarios
    getHorarios: async (estudianteId) => {
        try {
        const response = await axios.get(`${API_URL}/estudiante/${estudianteId}/horarios`);
        return response.data;
        } catch (error) {
        throw error.response?.data || { message: 'Error al obtener horarios' };
        }
    },

    // Obtener asistencias
    getInasistencias: async (estudianteId) => {
        try {
        let url = `${API_URL}/estudiante/${estudianteId}/inasistencias`;
        const response = await axios.get(url);
        return response.data;
        } catch (error) {
        throw error.response?.data || { message: 'Error al obtener inasistencias' };
        }
    },

    getNotificaciones: async (idUsuario) => {
        try {
            const url = `${API_URL}/notificaciones/${idUsuario}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener notificaciones' };
        }
    },

};

export default padreService;