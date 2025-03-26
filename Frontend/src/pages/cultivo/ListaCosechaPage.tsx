import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { Cosecha } from '@/types/cultivo/Cosecha';
import { useCosechas, useActualizarCosecha, useEliminarCosecha } from '@/hooks/cultivo/usecosecha';
import ReuModal from '@/components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla';
import { useCultivos } from '@/hooks/cultivo/useCultivo';


const ListaCosechaPage: React.FC = () => {
  const [selectedCosecha, setSelectedCosecha] = useState<Cosecha | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: cosechas, isLoading, refetch } = useCosechas();
  const {data: cultivo} = useCultivos()
  const actualizarMutation = useActualizarCosecha();
  const eliminarMutation = useEliminarCosecha();
  const navigate = useNavigate();

  const columns = [
    { name: 'ID Cultivo', uid: 'fk_cultivo' },
    { name: 'Fecha', uid: 'fecha' },
    { name: 'Cantidad', uid: 'cantidad' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (cosecha: Cosecha) => {
    setSelectedCosecha(cosecha);
    setIsEditModalOpen(true);
  };

  const handleDelete = (cosecha: Cosecha) => {
    setSelectedCosecha(cosecha);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCosecha && selectedCosecha.id !== undefined) {
      eliminarMutation.mutate(selectedCosecha.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (cosechas ?? []).map((cosecha) => ({
    id: cosecha.id?.toString() || '',
    fk_cultivo: cosecha.fk_cultivo,
    fecha: cosecha.fecha ? new Date(cosecha.fecha).toLocaleDateString() : 'Sin fecha',
    cantidad: `${cosecha.cantidad} kg`, 
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(cosecha)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(cosecha)}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registro de Cosechas</h2>

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
                  onClick={() => navigate('/cultivo/cosecha/')}
                >
                  Registrar Cosecha
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Cosecha"
        onConfirm={() => {
          if (selectedCosecha && selectedCosecha.id !== undefined) {
            actualizarMutation.mutate(
              { 
                id: selectedCosecha.id, 
                cosecha: selectedCosecha 
              },
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
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Cultivo</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCosecha?.fk_cultivo || 0}
              onChange={(e) =>
                setSelectedCosecha((prev: any) => ({
                  ...prev,
                  fk_cultivo: parseInt(e.target.value),
                }))
              }
            >
              <option value="">Seleccione un cultivo</option>
              {cultivo?.map((lote) => (
                <option key={lote.id} value={lote.id}>{lote.nombre}</option>
              ))}
            </select>
          </div>
        <ReuInput
          label="Fecha"
          type="date"
          value={selectedCosecha?.fecha ? new Date(selectedCosecha.fecha).toISOString().split('T')[0] : ''}
          onChange={(e) =>
            setSelectedCosecha((prev) => ({
              ...prev!,
              fecha: e.target.value,
            }))
          }
          required
        />
        <ReuInput
          label="Cantidad (kg)"
          placeholder="Ingrese la cantidad"
          type="number"
          value={selectedCosecha?.cantidad?.toString() || ''}
          onChange={(e) =>
            setSelectedCosecha((prev) => ({
              ...prev!,
              cantidad: parseInt(e.target.value),
            }))
          }
          required
          min="1"
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar esta cosecha?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaCosechaPage;