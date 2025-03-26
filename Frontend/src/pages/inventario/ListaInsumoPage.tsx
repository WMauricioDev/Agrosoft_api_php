import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useInsumos, useActualizarInsumo, useEliminarInsumo } from "@/hooks/inventario/useInsumo";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";
import { useBodegas } from "@/hooks/inventario/useBodega"; // Importa el hook para obtener bodegas

interface Insumo {
  id: number;
  fk_bodega: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

const ListaInsumoPage: React.FC = () => {
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: insumos, isLoading, refetch } = useInsumos();
  const { data: bodegas } = useBodegas(); // Obtener la lista de bodegas
  const actualizarMutation = useActualizarInsumo();
  const eliminarMutation = useEliminarInsumo();
  const navigate = useNavigate();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Precio", uid: "precio" },
    { name: "Cantidad", uid: "cantidad" },
    { name: "Bodega", uid: "fk_bodega" }, // Nuevo campo
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (insumo: Insumo) => {
    setSelectedInsumo({ ...insumo }); // Clonamos el objeto para edición
    setIsEditModalOpen(true);
  };

  const handleDelete = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedInsumo && selectedInsumo.id !== undefined) {
      eliminarMutation.mutate(selectedInsumo.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedInsumo(null);
          refetch();
        },
      });
    }
  };

  const transformedData = (insumos ?? []).map((insumo) => ({
    id: insumo.id?.toString() || "",
    nombre: insumo.nombre,
    descripcion: insumo.descripcion,
    precio: insumo.precio,
    cantidad: insumo.cantidad,
    fk_bodega: bodegas?.find((bodega) => bodega.id_bodega === insumo.fk_bodega)?.nombre || "Desconocida", // Mostrar el nombre de la bodega
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(insumo)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(insumo)}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Insumos</h2>

          {isLoading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : (
            <>
              <Tabla columns={columns} data={transformedData} />
              <div className="flex justify-end mt-4">
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() => navigate("/inventario/insumos/")}
                >
                  Registrar Insumo
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
        title="Editar Insumo"
      >
        {selectedInsumo && (
          <div className="w-full max-w-xs mx-auto p-4 bg-white rounded-lg shadow-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedInsumo && selectedInsumo.id !== undefined) {
                  actualizarMutation.mutate(selectedInsumo, {
                    onSuccess: () => {
                      setIsEditModalOpen(false);
                      refetch();
                    },
                  });
                }
              }}
            >
              <ReuInput
                label="Nombre"
                placeholder="Ingrese el nombre"
                type="text"
                value={selectedInsumo.nombre}
                onChange={(e) =>
                  setSelectedInsumo({ ...selectedInsumo, nombre: e.target.value })
                }
              />
              <ReuInput
                label="Descripción"
                placeholder="Ingrese la descripción"
                type="text"
                value={selectedInsumo.descripcion}
                onChange={(e) =>
                  setSelectedInsumo({ ...selectedInsumo, descripcion: e.target.value })
                }
              />
              <ReuInput
                label="Precio"
                placeholder="Ingrese el precio"
                type="number"
                value={selectedInsumo.precio.toString()}
                onChange={(e) =>
                  setSelectedInsumo({
                    ...selectedInsumo,
                    precio: Number(e.target.value),
                  })
                }
              />
              <ReuInput
                label="Cantidad"
                placeholder="Ingrese la cantidad"
                type="number"
                value={selectedInsumo.cantidad.toString()}
                onChange={(e) =>
                  setSelectedInsumo({
                    ...selectedInsumo,
                    cantidad: Number(e.target.value),
                  })
                }
              />
              {/* Campo: Bodega */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Bodega</label>
                <select
                  value={selectedInsumo.fk_bodega || ""}
                  onChange={(e) =>
                    setSelectedInsumo({
                      ...selectedInsumo,
                      fk_bodega: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Seleccione una bodega</option>
                  {bodegas?.map((bodega) => (
                    <option key={bodega.id_bodega} value={bodega.id_bodega}>
                      {bodega.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white w-full px-4 py-2 rounded-lg"
                disabled={actualizarMutation.isPending}
              >
                {actualizarMutation.isPending ? "Actualizando..." : "Actualizar"}
              </button>
            </form>
          </div>
        )}
      </ReuModal>

      {/* Modal de Eliminación */}
      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este insumo?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaInsumoPage;