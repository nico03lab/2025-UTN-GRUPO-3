import React, { useState } from 'react';
import { InscripcionForm } from '../components/InscripcionForm';
import {ToastContainer} from "react-toastify";

export const InscripcionPage = () => {
  const [formData, setFormData] = useState({
    // Datos del estudiante
    nombreEstudiante: '',
    apellidoEstudiante: '',
    dni: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    telefono: '',
    email: '',
    
    // Datos académicos
    cursoSolicitado: '',
    nivelEducativo: '',
    turnoSolicitado: '',
    
    // Datos del tutor/padre
    nombreTutor: '',
    apellidoTutor: '',
    dniTutor: '',
    relacionTutor: '',
    telefonoTutor: '',
    emailTutor: '',
    
    // Documentación
    certificadoNacimiento: false,
    certificadoEstudios: false,
    fotocopia_dni: false,
    certificadoMedico: false
  });
  try {
    
  } catch (error) {
    
  }
  return (
    <div>
      <InscripcionForm></InscripcionForm>
      <ToastContainer 
        position="bottom-right"
        autoClose= {3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme='light'
      />
    </div>
    
    
  )
}
