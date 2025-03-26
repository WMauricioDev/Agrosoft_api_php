import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useActividades, useInsumos, useUsuarios, useActualizarActividad, useEliminarActividad } from "@/hooks/cultivo/useActividad";
import { useTipoActividad } from "@/hooks/cultivo/usetipoactividad";
import { useProgramaciones } from "@/hooks/cultivo/useProgramacion";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import ReuModal from "@/components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { useNavigate } from "react-router-dom";

const ListaActividadPage: React.FC = () => {
    
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

    const [selectedActividad, setSelectedActividad] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const actualizarMutation = useActualizarActividad();
    const eliminarMutation = useEliminarActividad();
    const { data: actividades, isLoading, refetch } = useActividades();
    const { data: tiposActividad } = useTipoActividad();
    const { data: programaciones } = useProgramaciones();
    const { data: usuarios } = useUsuarios();
    const { data: cultivos } = useCultivos();
    const { data: insumos } = useInsumos();
    const navigate = useNavigate();

    const columns = [
        { name: "Título", uid: "titulo" },
        { name: "Fecha", uid: "fecha" },
        { name: "Descripción", uid: "descripcion" },
        { name: "Tipo Actividad", uid: "tipo_actividad" },
        { name: "Programación", uid: "programacion" },
        { name: "Usuario", uid: "usuario" },
        { name: "Cultivo", uid: "cultivo" },
        { name: "Insumo", uid: "insumo" },
        { name: "Cantidad", uid: "cantidad_producto" },
        { name: "Acciones", uid: "acciones" },
    ];

    const handleEdit = (actividad: any) => {
        setSelectedActividad(actividad);
        setActividad({
            fk_cultivo: actividad.fk_cultivo,
            fk_usuario: actividad.fk_usuario,
            fk_insumo: actividad.fk_insumo,
            fk_programacion: actividad.fk_programacion,
            fk_tipo_actividad: actividad.fk_tipo_actividad,
            titulo: actividad.titulo,
            descripcion: actividad.descripcion,
            fecha: actividad.fecha,
            cantidad_producto: actividad.cantidad_producto,
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (actividad: any) => {
        setSelectedActividad(actividad);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedActividad && selectedActividad.id !== undefined) {
            eliminarMutation.mutate(selectedActividad.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    refetch();
                },
            });
        }
    };

    const transformedData = (actividades ?? []).map((actividad) => ({
        id: actividad.id?.toString() || '',
        titulo: actividad.titulo,
        fecha: actividad.fecha,
        descripcion: actividad.descripcion,
        tipo_actividad: tiposActividad?.find((tipo) => tipo.id === actividad.fk_tipo_actividad)?.nombre || 'Sin tipo',
        programacion: programaciones?.find((prog) => prog.id_programacion === actividad.fk_programacion)?.ubicacion || 'Sin programación',
        usuario: usuarios?.find((user) => user.id === actividad.fk_usuario)?.nombre || 'Sin usuario',
        cultivo: cultivos?.find((cult) => cult.id === actividad.fk_cultivo)?.nombre || 'Sin cultivo',
        insumo: insumos?.find((ins) => ins.id === actividad.fk_insumo)?.nombre || 'Sin insumo',
        cantidad_producto: actividad.cantidad_producto,
        acciones: (
            <>
                <button
                    className="text-green-500 hover:underline mr-2"
                    onClick={() => handleEdit(actividad)}
                >
                    Editar
                </button>
                <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(actividad)}
                >
                    Eliminar
                </button>
            </>
        ),
    }));

    return (
        <DefaultLayout>
            <div className="w-full flex flex-col items-center min-h-screen p-6">
                <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Actividades</h2>
                    {isLoading ? (
                        <p className="text-gray-600">Cargando...</p>
                    ) : (
                        <>
                            <Tabla columns={columns} data={transformedData} />
                            <div className="flex justify-end mt-4">
                                <button
                                    className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg 
                                             hover:bg-blue-700 transition-all duration-300 ease-in-out 
                                             shadow-md hover:shadow-lg transform hover:scale-105"
                                    onClick={() => navigate('/cultivo/actividad/')}
                                >
                                    Registrar Actividad
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ReuModal
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                title="Editar Actividad"
                onConfirm={() => {
                    if (selectedActividad && selectedActividad.id !== undefined) {
                        actualizarMutation.mutate(
                            { id: selectedActividad.id, actividad },
                            {
                                onSuccess: () => {
                                    setIsEditModalOpen(false);
                                    refetch();
                                },
                            }
                        );
                    }
                }}
            >
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
                    onChange={(e) => setActividad({ ...actividad, fk_tipo_actividad: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="0">Seleccione un tipo de actividad</option>
                    {tiposActividad?.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">Programación</label>
                <select
                    value={actividad.fk_programacion}
                    onChange={(e) => setActividad({ ...actividad, fk_programacion: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="0">Seleccione una programación</option>
                    {programaciones?.map((prog) => (
                        <option key={prog.id_programacion} value={prog.id_programacion}>{prog.ubicacion}</option>
                    ))}
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">Usuario</label>
                <select
                    value={actividad.fk_usuario}
                    onChange={(e) => setActividad({ ...actividad, fk_usuario: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="0">Seleccione un usuario</option>
                    {usuarios?.map((user) => (
                        <option key={user.id} value={user.id}>{user.nombre}</option>
                    ))}
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">Cultivo</label>
                <select
                    value={actividad.fk_cultivo}
                    onChange={(e) => setActividad({ ...actividad, fk_cultivo: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="0">Seleccione un cultivo</option>
                    {cultivos?.map((cult) => (
                        <option key={cult.id} value={cult.id}>{cult.nombre}</option>
                    ))}
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">Insumo</label>
                <select
                    value={actividad.fk_insumo}
                    onChange={(e) => setActividad({ ...actividad, fk_insumo: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="0">Seleccione un insumo</option>
                    {insumos?.map((ins) => (
                        <option key={ins.id} value={ins.id}>{ins.nombre}</option>
                    ))}
                </select>
                <ReuInput
                    label="Cantidad de Producto"
                    type="number"
                    value={actividad.cantidad_producto}
                    onChange={(e) => setActividad({ ...actividad, cantidad_producto: Number(e.target.value) })}
                />
            </ReuModal>

            <ReuModal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="¿Estás seguro de eliminar esta actividad?"
                onConfirm={handleConfirmDelete}
            >
                <p>Esta acción es irreversible.</p>
            </ReuModal>

        </DefaultLayout>
    );
};

export default ListaActividadPage;