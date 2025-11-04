import axios from 'axios';

const API_URL = 'http://localhost:3002/api/docentes';

const docenteService = {
    //obtener al directivo
    getDocente: async (idUsuario) => {
        try{
            const response = await axios.get(`${API_URL}/${idUsuario}`);
            return response.data;
        }catch (error){
            throw error.response?.data || {message: 'Error al obtener al tutor'};
        }
    },
}

export default docenteService;