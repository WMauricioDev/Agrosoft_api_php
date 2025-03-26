import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useBodegas, useActualizarBodega, useEliminarBodega } from "@/hooks/inventario/useBodega";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";
import { Bodega } from "@/types/inventario/Bodega"; // Importa la interfaz Bodega

const ListaBodegaPage: React.FC = () => {
  const [selectedBodega, setSelectedBodega] = useState<Bodega | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: bodegas, isLoading, refetch } = useBodegas();
  const actualizarMutation = useActualizarBodega();
  const eliminarMutation = useEliminarBodega();
  const navigate = useNavigate();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Ubicación", uid: "ubicacion" },
    { name: "Tipo de Bodega", uid: "tipo_bodega" }, 
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (bodega: Bodega) => {
    setSelectedBodega({ ...bodega });
    setIsEditModalOpen(true);
  };

  const handleDelete = (bodega: Bodega) => {
    setSelectedBodega(bodega);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBodega && selectedBodega.id_bodega !== undefined) {
      eliminarMutation.mutate(selectedBodega.id_bodega, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedBodega(null);
          refetch();
        },
      });
    }
  };

  const transformedData = (bodegas ?? []).map((bodega) => ({
    id: bodega.id_bodega?.toString() || "",
    nombre: bodega.nombre,
    ubicacion: bodega.ubicacion,
    tipo_bodega: bodega.tipo_bodega, // Nuevo campo
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(bodega)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(bodega)}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Bodegas</h2>

          {isLoading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : (
            <>
              <Tabla columns={columns} data={transformedData} />
              <div className="flex justify-end mt-4">
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() => navigate("/inventario/bodega/")}
                >
                  Registrar Bodega
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Edición */}
      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Bodega"
        onConfirm={() => {
          if (selectedBodega && selectedBodega.id_bodega !== undefined) {
            actualizarMutation.mutate(selectedBodega, {
              onSuccess: () => {
                setIsEditModalOpen(false);
                refetch();
              },
            });
          }
        }}
      >
        {selectedBodega && (
          <>
            <ReuInput
              label="Nombre"
              placeholder="Ingrese el nombre"
              type="text"
              value={selectedBodega.nombre}
              onChange={(e) =>
                setSelectedBodega({ ...selectedBodega, nombre: e.target.value })
              }
            />
            <ReuInput
              label="Ubicación"
              placeholder="Ingrese la ubicación"
              type="text"
              value={selectedBodega.ubicacion}
              onChange={(e) =>
                setSelectedBodega({ ...selectedBodega, ubicacion: e.target.value })
              }
            />
            {/* Campo: Tipo de Bodega */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tipo de Bodega
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={selectedBodega.tipo_bodega}
                onChange={(e) =>
                  setSelectedBodega({
                    ...selectedBodega,
                    tipo_bodega: e.target.value as "Semillero" | "Cosecha" | "Herramientas",
                  })
                }
              >
                <option value="Semillero">Semillero</option>
                <option value="Cosecha">Cosecha</option>
                <option value="Herramientas">Herramientas</option>
              </select>
            </div>
          </>
        )}
      </ReuModal>

      {/* Modal de Eliminación */}
      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar esta bodega?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaBodegaPage;