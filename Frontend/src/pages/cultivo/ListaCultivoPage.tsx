import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useCultivos, useActualizarCultivo, useEliminarCultivo } from "@/hooks/cultivo/useCultivo";
import { useEspecies } from "@/hooks/cultivo/useEspecie";
import { useBancales } from "@/hooks/cultivo/usebancal";
import ReuModal from "@/components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { useNavigate } from "react-router-dom";

const ListarCultivoPage: React.FC = () => {
    const [selectedCultivo, setSelectedCultivo] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const actualizarMutation = useActualizarCultivo();
    const eliminarMutation = useEliminarCultivo();
    const { data: cultivos, isLoading, refetch } = useCultivos();
    const { data: especies } = useEspecies();
    const { data: bancales } = useBancales();
    const navigate = useNavigate();

    const columns = [
        { name: "Nombre", uid: "nombre" },
        { name: "Unidad de Medida", uid: "unidad_de_medida" },
        { name: "Activo", uid: "activo" },
        { name: "Fecha de Siembra", uid: "fecha_siembra" },
        { name: "Especie", uid: "fk_especie" },
        { name: "Bancal", uid: "fk_bancal" },
        { name: "Acciones", uid: "acciones" },
    ];

    const handleEdit = (cultivo: any) => {
        setSelectedCultivo({
            ...cultivo,
            fecha_siembra: cultivo.fechaSiembra, // Ajusta los nombres si es necesario
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (cultivo: any) => {
        setSelectedCultivo(cultivo);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedCultivo && selectedCultivo.id !== undefined) {
            eliminarMutation.mutate(selectedCultivo.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    refetch();
                },
            });
        }
    };

    const transformedData = (cultivos ?? []).map((cultivo) => ({
        id: cultivo.id?.toString() || '',
        nombre: cultivo.nombre,
        unidad_de_medida: cultivo.unidad_de_medida,
        activo: cultivo.estado,
        fecha_siembra: cultivo.fecha_siembra,
        fk_especie: especies?.find((especie) => especie.id === cultivo.fk_especie)?.nombre || 'Sin especie',
        fk_bancal: bancales?.find((bancal) => bancal.id === cultivo.fk_bancal)?.nombre || 'Sin bancal',
        acciones: (
            <>
                <button
                    className="text-green-500 hover:underline mr-2"
                    onClick={() => handleEdit(cultivo)}
                >
                    Editar
                </button>
                <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(cultivo)}
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
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Cultivos</h2>
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
                                    onClick={() => navigate('/cultivo/cultivo/')}
                                >
                                    Registrar Cultivo
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ReuModal
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                title="Editar Cultivo"
                onConfirm={() => {
                    if (selectedCultivo && selectedCultivo.id !== undefined) {
                        console.log("Datos a enviar:", selectedCultivo);
                        actualizarMutation.mutate(
                            { id: selectedCultivo.id, cultivo: selectedCultivo },
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
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    type="text"
                    value={selectedCultivo?.nombre || ''}
                    onChange={(e) =>
                        setSelectedCultivo((prev: any) => ({
                            ...prev,
                            nombre: e.target.value,
                        }))
                    }
                />
                <ReuInput
                    label="Unidad de Medida"
                    placeholder="Ej: kg, g, unidades"
                    type="text"
                    value={selectedCultivo?.unidad_de_medida || ''}
                    onChange={(e) =>
                        setSelectedCultivo((prev: any) => ({
                            ...prev,
                            unidad_de_medida: e.target.value,
                        }))
                    }
                />
                <ReuInput
                    label="Fecha de Siembra"
                    type="date"
                    value={selectedCultivo?.fecha_siembra || ''}
                    onChange={(e) =>
                        setSelectedCultivo((prev: any) => ({
                            ...prev,
                            fecha_siembra: e.target.value,
                        }))
                    }
                />
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={selectedCultivo?.activo}
                        onChange={(e) =>
                            setSelectedCultivo((prev: any) => ({
                                ...prev,
                                activo: e.target.checked,
                            }))
                        }
                        name="activo"
                    />
                    <span>Activo</span>
                </label>
                <label className="block text-sm font-medium text-gray-700 mt-4">Especie</label>
                <select
                    name="fk_especie"
                    value={selectedCultivo?.fk_especie || 0}
                    onChange={(e) =>
                        setSelectedCultivo((prev: any) => ({
                            ...prev,
                            fk_especie: parseInt(e.target.value),
                        }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Seleccione una especie</option>
                    {especies?.map((especie) => (
                        <option key={especie.id} value={especie.id}>{especie.nombre}</option>
                    ))}
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">Bancal</label>
                <select
                    name="fk_bancal"
                    value={selectedCultivo?.fk_bancal || 0}
                    onChange={(e) =>
                        setSelectedCultivo((prev: any) => ({
                            ...prev,
                            fk_bancal: parseInt(e.target.value),
                        }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Seleccione un bancal</option>
                    {bancales?.map((bancal) => (
                        <option key={bancal.id} value={bancal.id}>{bancal.nombre}</option>
                    ))}
                </select>
            </ReuModal>

            <ReuModal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="¿Estás seguro de eliminar este cultivo?"
                onConfirm={handleConfirmDelete}
            >
                <p>Esta acción es irreversible.</p>
            </ReuModal>
        </DefaultLayout>
    );
};

export default ListarCultivoPage;