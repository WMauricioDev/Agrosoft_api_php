import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { BodegaInsumo } from "@/types/inventario/BodegaInsumo";
import { Insumo } from "@/types/inventario/Insumo";
import { useBodegaInsumos, useActualizarBodegaInsumo, useEliminarBodegaInsumo } from "@/hooks/inventario/useBodegaInsumo";
import { useBodegas } from "@/hooks/inventario/useBodega";
import { useInsumos } from "@/hooks/inventario/useInsumo";
import ReuModal from "@/components/globales/ReuModal";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";

const ListaBodegaInsumoPage: React.FC = () => {
  const [selectedBodegaInsumo, setSelectedBodegaInsumo] = useState<BodegaInsumo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: bodegas } = useBodegas();
  const { data: insumos } = useInsumos();
  const { data: bodegaInsumos, isLoading, refetch } = useBodegaInsumos();
  const updateMutation = useActualizarBodegaInsumo();
  const deleteMutation = useEliminarBodegaInsumo();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedBodegaInsumo) {
      setSelectedBodegaInsumo((prev) => ({
        ...prev!,
        [name]: Number(value),
      }));
    }
  };

  const handleEdit = (bodegaInsumo: BodegaInsumo) => {
    setSelectedBodegaInsumo({ ...bodegaInsumo });
    setIsEditModalOpen(true);
  };

  const handleDelete = (bodegaInsumo: BodegaInsumo) => {
    setSelectedBodegaInsumo(bodegaInsumo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBodegaInsumo && selectedBodegaInsumo.id !== undefined) {
      deleteMutation.mutate(selectedBodegaInsumo.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBodegaInsumo && selectedBodegaInsumo.id !== undefined) {
      updateMutation.mutate(selectedBodegaInsumo, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          refetch();
        },
      });
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/inventario/bodegainsumo/");
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Bodega Insumos</h2>
          {isLoading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableColumn>Bodega</TableColumn>
                  <TableColumn>Insumo</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                  {bodegaInsumos?.map((item: BodegaInsumo) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {bodegas?.find((b: { id: number }) => b.id === item.bodega)?.nombre || "Desconocido"}
                      </TableCell>
                      <TableCell>
                        {insumos?.find((i: Insumo) => i.id === item.insumo)?.nombre || "Desconocido"}
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
                  Registrar Bodega Insumo
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Bodega Insumo"
      >
        {selectedBodegaInsumo && (
          <div className="w-full max-w-xs mx-auto p-4 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <select
                name="bodega"
                value={selectedBodegaInsumo.bodega}
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
                name="insumo"
                value={selectedBodegaInsumo.insumo}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="0">Seleccione un Insumo</option>
                {insumos?.map((insumo: Insumo) => (
                  <option key={insumo.id} value={insumo.id}>
                    {insumo.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="cantidad"
                value={selectedBodegaInsumo.cantidad}
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

export default ListaBodegaInsumoPage;