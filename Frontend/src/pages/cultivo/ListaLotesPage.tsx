import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { useNavigate } from "react-router-dom";
import { useLotes, useActualizarLote, useEliminarLote } from "../../hooks/cultivo/uselotes";
import { Lote } from "../../types/cultivo/Lotes";
import Tabla from "@/components/globales/Tabla";
import ReuModal from "../../components/globales/ReuModal";

const ListarLotesPage: React.FC = () => {
  const [lote, setLote] = useState<Lote>({
    nombre: "",
    descripcion: "",
    estado: "activo",
    tamx: 0,
    tamy: 0,
    posx: 0,
    posy: 0,
  });

  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const actualizarMutation = useActualizarLote();
  const eliminarMutation = useEliminarLote();
  const { data: lotes, isLoading } = useLotes();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "estado", uid: "estado" },
    { name: "Tamaño X", uid: "tam_x" },
    { name: "Tamaño Y", uid: "tam_y" },
    { name: "Posición X", uid: "pos_x" },
    { name: "Posición Y", uid: "pos_y" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (lote: Lote) => {
    setSelectedLote(lote);
    setLote(lote);
    setIsEditModalOpen(true);
  };

  const handleDelete = (lote: Lote) => {
    setSelectedLote(lote);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedLote && selectedLote.id !== undefined) {
      eliminarMutation.mutate(selectedLote.id);
      setIsDeleteModalOpen(false);
    }
  };
  const navigate = useNavigate()

  const transformedData = (lotes ?? []).map((lote) => ({
    id: lote.id?.toString() || '',
    nombre: lote.nombre,
    descripcion: lote.descripcion,
    estado: lote.estado,
    tam_x: lote.tamx,
    tam_y: lote.tamy,
    pos_x: lote.posx,
    pos_y: lote.posy,
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(lote)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(lote)}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Lotes</h2>

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
                  onClick={() => navigate('/cultivo/lotes')} 
                >
                  Registrar Lote
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Lote"
        onConfirm={() => {
          if (selectedLote && selectedLote.id !== undefined) {
            actualizarMutation.mutate({
              id: selectedLote.id,
              lote,
            });
            setIsEditModalOpen(false);
          }
        }}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={lote.nombre}
          onChange={(e) => setLote({ ...lote, nombre: e.target.value })}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={lote.descripcion}
          onChange={(e) => setLote({ ...lote, descripcion: e.target.value })}
        />

          <label className="text-gray-700 font-medium">Estado</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={lote.estado}
              onChange={(e) => setLote({ ...lote, estado: e.target.value })}
            >
              <option value="activo">Activo</option>
              <option value="ocupado">Ocupado</option>
              <option value="en proceso de adecuamiento">En proceso de adecuamiento</option>
            </select>

        <div className="grid grid-cols-2 gap-4">
          <ReuInput
            label="Tamaño X"
            placeholder="Ingrese tamaño X"
            type="number"
            value={lote.tamx.toString()}
            onChange={(e) => setLote({ ...lote, tamx: parseFloat(e.target.value) })}
          />

          <ReuInput
            label="Tamaño Y"
            placeholder="Ingrese tamaño Y"
            type="number"
            value={lote.tamy.toString()}
            onChange={(e) => setLote({ ...lote, tamy: parseFloat(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ReuInput
            label="Posición X"
            placeholder="Ingrese posición X"
            type="number"
            value={lote.posx.toString()}
            onChange={(e) => setLote({ ...lote, posx: parseFloat(e.target.value) })}
          />

          <ReuInput
            label="Posición Y"
            placeholder="Ingrese posición Y"
            type="number"
            value={lote.posy.toString()}
            onChange={(e) => setLote({ ...lote, posy: parseFloat(e.target.value) })}
          />
        </div>
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este lote?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListarLotesPage;