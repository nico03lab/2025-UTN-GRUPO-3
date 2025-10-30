import {useState, useEffect} from 'react';
import { ConfigInputField } from './ConfiguracionInputField';
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Cog  } from 'lucide-react';

export const ConfiguracionModal = ({
    userRole, 
    userId,
    fieldsConfig,
    apiEndpoint
}) => {
    const API_BASE_URL = "http://localhost:3002/api";

    const [modalAbierto, setModalAbierto] = useState(false);
    const [datos, setDatos] = useState({});
    const [hijosData, setHijosData] = useState([]);
    const [guardando, setGuardando] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [datosListos, setDatosListos] = useState(false); 

    useEffect(() => {
        if (modalAbierto) {
            setDatosListos(false); 
            cargarDatos();
        }
    }, [modalAbierto]);

    const cargarDatos = async () => {
        setCargando(true);
        setDatosListos(false); 
        
        try {
            const response = await axios.get(`${API_BASE_URL}/${apiEndpoint}/${userId}`);
                        
            const responseData = response.data.success ? response.data.data : response.data;
            
            if (responseData.tutor) {
                setDatos(responseData.tutor);
                
                if (Array.isArray(responseData.hijos)) {
                    setHijosData(responseData.hijos);
                }
            } else {
                setDatos(responseData);
            }
            
            setTimeout(() => {
                setDatosListos(true);
            }, 100);
            
        } catch (error) {
            console.error(" Error al cargar datos: ", error);
            toast.error('Error al cargar los datos');
        } finally {
            setCargando(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setDatos(prev => ({
            ...prev, 
            [name]: value
        }));
    };

    const handleUpdateHijo = async (hijoActualizado) => {
        try {
            await axios.put(
                `${API_BASE_URL}/alumnos/configuracion/${hijoActualizado.DNIAlumno}`,
                hijoActualizado
            );
            
            setHijosData(prev => 
                prev.map(h => 
                    h.DNIAlumno === hijoActualizado.DNIAlumno 
                        ? hijoActualizado 
                        : h
                )
            );
            
            toast.success('Datos del hijo actualizados correctamente');
            cargarDatos(); //dudodso aun, porque se perderian los datos cambiados para el tutor 
        
        } catch (error) {
            console.error('Error al actualizar hijo:', error);
            toast.error('Error al actualizar los datos del hijo');
        }
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setGuardando(true);

        try {
            console.log("Datos actualizados: ", datos);

            await axios.put(`${API_BASE_URL}/${apiEndpoint}/${userId}`, datos);
            toast.success('Datos guardados correctamente');
            setModalAbierto(false);
        } catch (error) {
            console.error('Error al guardar:', error);
            toast.error('Error al guardar los datos');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setModalAbierto(true)}
                className="btn btn-circle btn-ghost"
                title="Configuración"
            >
                <Cog className="h-6 w-6" />
            </button>

            {modalAbierto && (
                <dialog open className="modal">
                    <div className="modal-box w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 sticky top-0 bg-base-100 z-10 pb-2">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Cog6ToothIcon className="h-6 w-6 text-primary" />
                                Configuración - {userRole}
                            </h3>
                            <button
                                onClick={() => setModalAbierto(false)}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {cargando || !datosListos ? ( // ⬅CAMBIO AQUÍ
                            <div className="flex justify-center items-center py-10">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : (
                            <form onSubmit={handleGuardar}>
                                {fieldsConfig.map((section, idx) => (
                                    <div key={idx} className="mb-6">
                                        <h4 className="font-semibold text-base mb-3 text-base-content/70">
                                            {section.section}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {section.fields.map((field) => {
                                                const fieldValue = datos[field.name] || '';
                                                
                                                return (
                                                    <ConfigInputField
                                                        key={field.name}
                                                        {...field}
                                                        value={fieldValue}
                                                        onChange={handleInputChange}
                                                        customData={field.name === 'hijos' ? hijosData : null}
                                                        onUpdateHijo={field.name === 'hijos' ? handleUpdateHijo : null}
                                                        dniTutor = {datos.DNITutor}
                                                        className={
                                                            field.type === 'textarea' || field.type === 'custom' 
                                                                ? 'md:col-span-2' 
                                                                : ''
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <div className="modal-action sticky bottom-0 bg-base-100 pt-4">
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={() => setModalAbierto(false)}
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
                                            'Guardar cambios'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setModalAbierto(false)}>close</button>
                    </form>
                </dialog>
            )}
        </>
    );
};

export default ConfiguracionModal;