import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { Plaga } from '../../types/cultivo/Plaga'; 
import { usePlagas, useActualizarPlaga, useEliminarPlaga } from '../../hooks/cultivo/useplaga'; 
import ReuModal from '../../components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla';

const ListaPlagasPage: React.FC = () => {
  const [selectedPlaga, setSelectedPlaga] = useState<Plaga | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: plagas, isLoading, refetch } = usePlagas();
  const actualizarMutation = useActualizarPlaga();
  const eliminarMutation = useEliminarPlaga();
  const navigate = useNavigate();

  const columns = [
    { name: 'Nombre', uid: 'nombre' },
    { name: 'Descripción', uid: 'descripcion' },
    { name: 'Tipo de Plaga', uid: 'tipo_plaga' },
    { name: 'Imagen', uid: 'imagen' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (plaga: Plaga) => {
    setSelectedPlaga(plaga);
    setIsEditModalOpen(true);
  };

  const handleDelete = (plaga: Plaga) => {
    setSelectedPlaga(plaga);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPlaga && selectedPlaga.id !== undefined) {
      eliminarMutation.mutate(selectedPlaga.id as number, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (plagas ?? []).map((plaga) => ({
    id: plaga.id?.toString() || '',
    nombre: plaga.nombre,
    descripcion: plaga.descripcion,
    tipo_plaga: plaga.fk_tipo_plaga || 'Sin tipo',
    imagen: plaga.img
      ? typeof plaga.img === 'string'
        ? plaga.img
        : URL.createObjectURL(plaga.img)
      : 'Sin imagen',
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(plaga)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(plaga)}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Plagas</h2>

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
                  onClick={() => navigate('/cultivo/plaga')} 
                >
                  Registrar Plaga
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Plaga"
        onConfirm={() => {
          if (selectedPlaga && selectedPlaga.id !== undefined) {
            actualizarMutation.mutate(
              { id: selectedPlaga.id as number, plaga: selectedPlaga },
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
          value={selectedPlaga?.nombre || ''}
          onChange={(e) =>
            setSelectedPlaga((prev) => ({
              ...prev!,
              nombre: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={selectedPlaga?.descripcion || ''}
          onChange={(e) =>
            setSelectedPlaga((prev) => ({
              ...prev!,
              descripcion: e.target.value,
            }))
          }
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar esta plaga?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaPlagasPage;