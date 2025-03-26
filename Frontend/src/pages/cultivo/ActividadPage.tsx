import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarActividad, useInsumos, useUsuarios } from "@/hooks/cultivo/useActividad";
import { useTipoActividad } from "@/hooks/cultivo/usetipoactividad";
import { useProgramaciones } from "@/hooks/cultivo/useProgramacion";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { useNavigate } from "react-router-dom";

const ActividadPage: React.FC = () => {
    const [actividad, setActividad] = useState({
        fk_cultivo: 0,
        fk_usuario: 0,
        fk_insumo: 0,
        fk_programacion: 0,
        fk_tipo_actividad: 0,
        titulo: "",
        descripcion: "",
        fecha: "",
        cantidad_producto: 0,
    });

    const mutation = useRegistrarActividad();
    const { data: tiposActividad } = useTipoActividad();
    const { data: programaciones } = useProgramaciones();
    const { data: usuarios } = useUsuarios();
    const { data: cultivos } = useCultivos();
    const { data: insumos } = useInsumos();
    const navigate = useNavigate();

    return (
        <DefaultLayout>
            <div className="w-full flex flex-col items-center min-h-screen p-6">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Asignar actividad</h2>

                    <ReuInput
                        label="Título"
                        placeholder="Ingrese el título"
                        type="text"
                        value={actividad.titulo}
                        onChange={(e) => setActividad({ ...actividad, titulo: e.target.value })}
                    />

                    <ReuInput
                        label="Fecha"
                        type="date"
                        value={actividad.fecha}
                        onChange={(e) => setActividad({ ...actividad, fecha: e.target.value })}
                    />

                    <ReuInput
                        label="Descripción"
                        placeholder="Ingrese la descripción"
                        type="text"
                        value={actividad.descripcion}
                        onChange={(e) => setActividad({ ...actividad, descripcion: e.target.value })}
                    />

                    <label className="block text-sm font-medium text-gray-700 mt-4">Tipo de Actividad</label>
                    <select 
                        value={actividad.fk_tipo_actividad} 
                        onChange={(e) => setActividad({ ...actividad, fk_tipo_actividad: Number(e.target.value) })}
                        className="w-full p-2 border rounded-md mt-1"
                    >
                        <option value="0">Seleccione un tipo de actividad</option>
                        {tiposActividad?.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                        ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mt-4">Programación</label>
                    <select 
                        value={actividad.fk_programacion} 
                        onChange={(e) => setActividad({ ...actividad, fk_programacion: Number(e.target.value) })}
                        className="w-full p-2 border rounded-md mt-1"
                    >
                        <option value="0">Seleccione una programación</option>
                        {programaciones?.map((programacion) => (
                            <option key={programacion.id_programacion} value={programacion.id_programacion}>{programacion.ubicacion}</option>
                        ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mt-4">Usuario</label>
                    <select 
                        value={actividad.fk_usuario} 
                        onChange={(e) => setActividad({ ...actividad, fk_usuario: Number(e.target.value) })}
                        className="w-full p-2 border rounded-md mt-1"
                    >
                        <option value="0">Seleccione un usuario</option>
                        {usuarios?.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>{usuario.nombre}</option>
                        ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mt-4">Cultivo</label>
                    <select 
                        value={actividad.fk_cultivo} 
                        onChange={(e) => setActividad({ ...actividad, fk_cultivo: Number(e.target.value) })}
                        className="w-full p-2 border rounded-md mt-1"
                    >
                        <option value="0">Seleccione un cultivo</option>
                        {cultivos?.map((cultivo) => (
                            <option key={cultivo.id} value={cultivo.id}>{cultivo.nombre}</option>
                        ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mt-4">Insumo</label>
                    <select 
                        value={actividad.fk_insumo} 
                        onChange={(e) => setActividad({ ...actividad, fk_insumo: Number(e.target.value) })}
                        className="w-full p-2 border rounded-md mt-1"
                    >
                        <option value="0">Seleccione un insumo</option>
                        {insumos?.map((insumo) => (
                            <option key={insumo.id} value={insumo.id}>{insumo.nombre}</option>
                        ))}
                    </select>

                    <ReuInput
                        label="Cantidad de Producto"
                        type="number"
                        value={actividad.cantidad_producto}
                        onChange={(e) => setActividad({ ...actividad, cantidad_producto: Number(e.target.value) })}
                    />

                    <button
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
                        type="button"
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate(actividad)}
                    >
                        {mutation.isPending ? "Registrando..." : "Guardar"}
                    </button>
                    
                    <button
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
                        onClick={() => navigate("/cultivo/listaractividad/")}
                    >
                        Listar actividades
                    </button>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ActividadPage;