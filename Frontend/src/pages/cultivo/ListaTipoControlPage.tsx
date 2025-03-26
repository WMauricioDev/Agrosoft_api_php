import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";
import { ReuInput } from "../../components/globales/ReuInput";
import { TipoControl } from "@/types/cultivo/TipoControl";
import { useTipoControl, useActualizarTipoControl, useEliminarTipoControl } from "../../hooks/cultivo/usetipocontrol";
import ReuModal from "../../components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";

const ListaTipoControlPage: React.FC = () => {
  const [tipoControl, setTipoControl] = useState<TipoControl>({
    nombre: "",
    descripcion: "",
  });

  const [selectedTipoControl, setSelectedTipoControl] = useState<TipoControl | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const actualizarMutation = useActualizarTipoControl();
  const navigate = useNavigate();
  const eliminarMutation = useEliminarTipoControl();
  const { data: tipoControles, isLoading } = useTipoControl();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (tipoControl: TipoControl) => {
    setSelectedTipoControl(tipoControl);
    setTipoControl(tipoControl);
    setIsEditModalOpen(true);
  };

  const handleDelete = (tipoControl: TipoControl) => {
    setSelectedTipoControl(tipoControl);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTipoControl && selectedTipoControl.id !== undefined) {
      eliminarMutation.mutate(selectedTipoControl.id);
      setIsDeleteModalOpen(false);
    }
  };

  const transformedData = (tipoControles ?? []).map((tipoControl) => ({
    id: tipoControl.id?.toString() || '',
    nombre: tipoControl.nombre,
    descripcion: tipoControl.descripcion,
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(tipoControl)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(tipoControl)}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Tipos de Control</h2>
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
                  onClick={() => navigate('/cultivo/tipo_control')} 
                >
                  Registrar tipo de control
                </button>
              </div>
            </>
          )}
        </div>
      </div>

    
      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Tipo de Control"
        onConfirm={() => {
          if (selectedTipoControl && selectedTipoControl.id !== undefined) {
            actualizarMutation.mutate({
              id: selectedTipoControl.id,
              tipoControl,
            });
            setIsEditModalOpen(false);
          }
        }}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={tipoControl.nombre}
          onChange={(e) => setTipoControl({ ...tipoControl, nombre: e.target.value })}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={tipoControl.descripcion}
          onChange={(e) => setTipoControl({ ...tipoControl, descripcion: e.target.value })}
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este tipo de control?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaTipoControlPage;