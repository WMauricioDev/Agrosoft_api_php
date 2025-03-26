import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { BodegaHerramienta } from "@/types/inventario/BodegaHerramienta";
import { useBodegaHerramienta, useActualizarBodegaHerramienta, useEliminarBodegaHerramienta } from "@/hooks/inventario/useBodegaHerramienta";
import { useBodegas } from "@/hooks/inventario/useBodega";
import { useHerramientas } from "@/hooks/inventario/useHerramientas";
import ReuModal from "@/components/globales/ReuModal";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";

const ListaBodegaHerramientaPage: React.FC = () => {
  const [selectedBodegaHerramienta, setSelectedBodegaHerramienta] = useState<BodegaHerramienta | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: bodegas } = useBodegas();
  const { data: herramientas } = useHerramientas();
  const { data: bodegaHerramientas, isLoading, refetch } = useBodegaHerramienta();
  const updateMutation = useActualizarBodegaHerramienta();
  const deleteMutation = useEliminarBodegaHerramienta();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedBodegaHerramienta) {
      setSelectedBodegaHerramienta((prev) => ({
        ...prev!,
        [name]: Number(value),
      }));
    }
  };

  const handleEdit = (bodegaHerramienta: BodegaHerramienta) => {
    setSelectedBodegaHerramienta({ ...bodegaHerramienta });
    setIsEditModalOpen(true);
  };

  const handleDelete = (bodegaHerramienta: BodegaHerramienta) => {
    setSelectedBodegaHerramienta(bodegaHerramienta);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBodegaHerramienta && selectedBodegaHerramienta.id !== undefined) {
      deleteMutation.mutate(selectedBodegaHerramienta.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBodegaHerramienta && selectedBodegaHerramienta.id !== undefined) {
      updateMutation.mutate(selectedBodegaHerramienta, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          refetch();
        },
      });
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/inventario/bodegaherramienta/");
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Bodega Herramientas</h2>
          {isLoading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : !bodegaHerramientas || bodegaHerramientas.length === 0 ? (
            <p className="text-gray-600">No hay datos disponibles.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableColumn>Bodega</TableColumn>
                  <TableColumn>Herramienta</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                  {bodegaHerramientas.map((item: BodegaHerramienta) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {bodegas?.find((b) => b.id === item.bodega)?.nombre || "Desconocido"}
                      </TableCell>
                      <TableCell>
                        {herramientas?.find((h) => h.id === item.herramienta)?.nombre || "Desconocido"}
                      </TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>
                        <button
                          className="text-green-500 hover:underline mr-2"
                          onClick={() => handleEdit(item)}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDelete(item)}
                        >
                          Eliminar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={handleNavigateToRegister}
                >
                  Registrar Bodega Herramienta
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Bodega Herramienta"
      >
        {selectedBodegaHerramienta && (
          <div className="w-full max-w-xs mx-auto p-4 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <select
                name="bodega"
                value={selectedBodegaHerramienta.bodega}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="0">Seleccione una Bodega</option>
                {bodegas?.map((bodega: { id: number; nombre: string }) => (
                  <option key={bodega.id} value={bodega.id}>
                    {bodega.nombre}
                  </option>
                ))}
              </select>
              <select
                name="herramienta"
                value={selectedBodegaHerramienta.herramienta}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="0">Seleccione una Herramienta</option>
                {herramientas?.map((herramienta: { id: number; nombre: string }) => (
                  <option key={herramienta.id} value={herramienta.id}>
                    {herramienta.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="cantidad"
                value={selectedBodegaHerramienta.cantidad}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                placeholder="Cantidad"
              />
              <Button
                className="bg-green-600 text-white w-full"
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Actualizando..." : "Actualizar"}
              </Button>
            </form>
          </div>
        )}
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este registro?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaBodegaHerramientaPage;