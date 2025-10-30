import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { UserGroupIcon} from "@heroicons/react/24/outline"; 
import { InputField } from "./InputField";
import { UserPlus } from 'lucide-react';
import { toast } from "react-toastify";

/**
 * DocentesManage.jsx
 * Panel completo de gestión de docentes para directivos.
 * - Carga docentes del backend
 * - Filtra en tiempo real por nombre, apellido, DNI o materia
 * - Muestra estadísticas generales
 * - Permite dar de alta un docente
 */

export default function DocentesManage() {
  const API_BASE_URL = "http://localhost:3002/api";

  const [docentes, setDocentes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState({});
  const [cursos, setCursos] = useState([]);

  //para la listas desplegables
  const localidadesOptions = [
    { value: 'La Plata', label: 'La Plata' },
    { value: 'Berrisso', label: 'Berisso' },
    { value: 'Ensenada', label: 'Ensenada' },
    { value: 'Gonnet', label: 'Gonnet' },
    { value: 'Ringuelet', label: 'Ringuelet' }
  ];
  const provinciaOptions = [
    { value: 'Buenos Aires', label: 'Buenos Aires' }
  ];

  //para dar de alta un docente 
  const [nuevoDocente, setNuevoDocente] = useState({
    DNIDocente: "",
    Apellido: "",
    Nombre: "",
    Calle: "",
    Numero: "",
    Localidad: "",
    Provincia: "",
    TelefonoCel: "",
    TelefonoLinea: "",
    Email: "",
    CursoAsignado: ""
  });
  const [guardando, setGuardando] = useState(false);

  // Agrupar docentes por DNI con sus materias
  const docentesAgrupados = useMemo(() => {
    return docentes.reduce((acc, curr) => {
      const existente = acc.find(d => d.DNIDocente === curr.DNIDocente);
      
      if (existente) {
        if (curr.Materia && !existente.materias.includes(curr.Materia)) {
          existente.materias.push(curr.Materia);
        }
      } else {
        acc.push({
          DNIDocente: curr.DNIDocente,
          Nombre: curr.Nombre,
          Apellido: curr.Apellido,
          Email: curr.Email,
          materias: curr.Materia ? [curr.Materia] : []
        });
      }
      
      return acc;
    }, []);
  }, [docentes]);

  //Filtrado en tiempo real (nombre, apellido, DNI o materia)
  const docentesFiltrados = useMemo(() => {
    return docentesAgrupados.filter((d) => {
      const texto = `${d.Nombre} ${d.Apellido} ${d.DNIDocente} ${d.Email} ${d.materias.join(' ')}`.toLowerCase();
      return texto.includes(search.toLowerCase());
    });
  }, [docentesAgrupados, search]);

  const toggleExpand = (dni) => {
    setExpandido(prev => ({
      ...prev,
      [dni]: !prev[dni]
    }));
  };

  //Estadísticas rápidas
  const stats = {
    total: docentesAgrupados.length,
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/docentes/materias`)
      .then((res) => {
        setDocentes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener docentes:", err);
        setLoading(false);
      });
  }, []);

  //cargar cursos disponibles
  useEffect(()=>{
    axios 
      .get(`${API_BASE_URL}/cursos/disponibles`)
      .then((res) => {
        const cursosParaInput = res.data.map((c) =>({
          value: `${c.IdCurso}/${c.IdMateria}`,
          label: `${c.IdCurso}, ${c.Especialidad} (${c.Turno}) - ${c.Materia}`
        }));
        setCursos(cursosParaInput);
        setLoading(false);
      })
      .catch((err)=> {
        console.error("Error al obtener cursos: ", err);
      })
  }, []);

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoDocente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para guardar el nuevo docente
  const handleGuardarDocente = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      // Crear el docente
      const responseDocente = await axios.post(`${API_BASE_URL}/docentes/nuevo`, {
        DNIDocente: nuevoDocente.DNIDocente,
        Nombre: nuevoDocente.Nombre,
        Apellido: nuevoDocente.Apellido,
        Calle: nuevoDocente.Calle,
        Numero: nuevoDocente.Numero,
        Localidad: nuevoDocente.Localidad,
        Provincia: nuevoDocente.Provincia,
        TelefonoCel: nuevoDocente.TelefonoCel,
        TelefonoLinea: nuevoDocente.TelefonoLinea,
        Email: nuevoDocente.Email
      });
     
      // Asignar cursos si se ha seleccionado
     if (nuevoDocente.CursoAsignado) {
        console.log(nuevoDocente.CursoAsignado);
        const [IdCurso, IdMateria] = nuevoDocente.CursoAsignado.split('/');  // Convierte a números
        console.log("Datos a enviar:", IdCurso, IdMateria);
        await axios.put(`${API_BASE_URL}/docentes/${nuevoDocente.DNIDocente}/Curso-Materia`, {
          IdCurso,
          IdMateria
        });
      }
      // Recargar la lista de docentes
      const res = await axios.get(`${API_BASE_URL}/docentes/materias`);
      setDocentes(res.data);
      
      // Limpiar el formulario
      setNuevoDocente({
        DNIDocente: "",
        Nombre: "",
        Apellido: "",
        Email: "",
        Telefono: "",
        Direccion: "",
        CursoAsignado: ""
      });
      // Cerrar el modal
      document.getElementById('modal_nuevo_docente').close();
      
      // Mostrar mensaje de éxito
      toast.success("¡Docente agregado correctamente!");
  
    } catch (error) {
      console.error("Error al guardar docente:", error);
      toast.error(error.response?.data?.error || "Error al guardar el docente. Por favor intente nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Listado de Docentes</h3>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o materia..."
            className="input input-bordered w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Estadísticas en una línea */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-base-content/70">Total de docentes: </span>
          <span className="text-xl font-semibold text-primary">  {stats.total}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botón para abrir modal */}
          <button className="btn btn-primary btn-sm gap-2 " onClick={() => document.getElementById('modal_nuevo_docente').showModal()}>
            <UserPlus className="h-4 w-4" />
            Nuevo Docente
          </button>
        </div>

      </div>

      {/* Tabla de docentes */}
      <div className="overflow-x-auto rounded-box bg-base-100 shadow">
        {loading ? (
          <div className="p-6 text-center opacity-70">Cargando docentes...</div>
        ) : docentesFiltrados.length === 0 ? (
          <div className="p-6 text-center opacity-70">No se encontraron docentes.</div>
        ) : (
          <table className="table table-zebra table-sm w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>DNI</th>
                <th>Nombre y Apellido</th>
                <th>Materias</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {docentesFiltrados.map((d) => (
                <tr key={d.DNIDocente}>
                  <td>{d.DNIDocente}</td>
                  <td>{d.Apellido} {d.Nombre}</td>
                  <td>
                    <div>
                      <button 
                        onClick={() => toggleExpand(d.DNIDocente)}
                        className="flex items-center gap-2 text-blue-900 hover:text-blue-900 transition-colors "
                        >
                        <span className="text-xs text-blue-900">{expandido[d.DNIDocente] ? '▼' : '▶'}</span>
                        <span className="font-medium">
                            {d.materias.length} materia{d.materias.length !== 1 ? 's' : ''}
                        </span>
                      </button>
                      
                      {expandido[d.DNIDocente] && (
                        <ul className="mt-2 ml-4 space-y-1">
                          {d.materias.length > 0 ? (
                            d.materias.map((materia, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <span className="text-primary">•</span>
                                <span>{materia}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-base-content/50">Sin materias asignadas</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td className="text-xs">{d.Email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
        <div>
          {/* MODAL NUEVO DOCENTE */}
          <dialog id="modal_nuevo_docente" className="modal">
            <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Agregar Nuevo Docente
              </h3>
              
              <form onSubmit={handleGuardarDocente}>
                {/* Datos personales */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-base-content/70">Datos Personales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="DNI"
                      name="DNIDocente"
                      value={nuevoDocente.DNIDocente}
                      onChange={handleInputChange}
                      placeholder="Ej: 12345678"
                      required
                    />
                     <InputField
                      label="Nombre"
                      name="Nombre"
                      value={nuevoDocente.Nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan"
                      required
                    />
                    <InputField
                      label="Apellido"
                      name="Apellido"
                      value={nuevoDocente.Apellido}
                      onChange={handleInputChange}
                      placeholder="Ej: Peréz"
                      required
                    />
                    <InputField
                      label="Email"
                      name="Email"
                      value={nuevoDocente.Email}
                      onChange={handleInputChange}
                      placeholder="docente@colegio.edu"
                      required
                    />
                      <InputField
                        label="Calle"
                        name="Calle"
                        value={nuevoDocente.Calle}
                        onChange={handleInputChange}
                        placeholder="Ej: 74"
                      />
                      <InputField
                        label="Numero"
                        name="Numero"
                        value={nuevoDocente.Numero}
                        onChange={handleInputChange}
                        placeholder="Ej: 440"
                      />
                      <InputField
                        label="Localidad"
                        name="Localidad"
                        value={nuevoDocente.Localidad}
                        onChange={handleInputChange}
                        placeholder="Seleccionar localidad"
                        options={localidadesOptions}
                      />
                        <InputField
                          label="Provincia"
                          name="Provincia"
                          value={nuevoDocente.Provincia}
                          onChange={handleInputChange}
                          placeholder="Seleccionar provincia"
                          options={provinciaOptions}
                        />
                    
                    <InputField
                      label="Telefono Celular"
                      name="TelefonoCel"
                      value={nuevoDocente.TelefonoCel}
                      onChange={handleInputChange}
                      placeholder="Ej: 221-1234567"
                      required
                    />
                    <InputField
                      label="Telefono Linea"
                      name="TelefonoLinea"
                      value={nuevoDocente.TelefonoLinea}
                      onChange={handleInputChange}
                      placeholder="Ej: 42115544 "
                    />
                    
                    {/* Asignación de Curso */}
                      <InputField
                        label="Curso"
                        name="CursoAsignado"
                        value={nuevoDocente.CursoAsignado}
                        onChange={handleInputChange}
                        placeholder="Seleccionar Curso-Materia"
                        options={cursos}
                        required
                      />
                  </div>
                </div>                

                <div className="modal-action">
                  <button 
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      document.getElementById('modal_nuevo_docente').close();
                      setNuevoDocente({
                        DNIDocente: "",
                        Apellido: "",
                        Nombre: "",
                        Calle: "",
                        Numero: "",
                        Localidad: "",
                        Provincia: "",
                        TelefonoCel: "",
                        TelefonoLinea: "",
                        Email: "",
                        CursoAsignado: ""
                      });
                    }}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={guardando}
                  >
                    {guardando ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Guardando...
                      </>
                    ) : (
                      "Guardar Docente"
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Backdrop para cerrar al hacer clic afuera */}
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
    </div>
  );
}