import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { TipoPlaga } from '../../types/cultivo/TipoPlaga'; // Asegúrate de que este tipo esté definido
import { useTipoPlagas, useActualizarTipoPlaga, useEliminarTipoPlaga } from '../../hooks/cultivo/usetipoplaga'; // Asegúrate de que estos hooks estén definidos
import ReuModal from '../../components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla';

const ListaTipoPlagaPage: React.FC = () => {
  const [selectedTipoPlaga, setSelectedTipoPlaga] = useState<TipoPlaga | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: plagas, isLoading, refetch } = useTipoPlagas();
  const actualizarMutation = useActualizarTipoPlaga();
  const eliminarMutation = useEliminarTipoPlaga();
  const navigate = useNavigate();

  const columns = [
    { name: 'Nombre', uid: 'nombre' },
    { name: 'Descripción', uid: 'descripcion' },
    { name: 'Imagen', uid: 'imagen' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (plaga: TipoPlaga) => {
    setSelectedTipoPlaga(plaga);
    setIsEditModalOpen(true);
  };

  const handleDelete = (plaga: TipoPlaga) => {
    setSelectedTipoPlaga(plaga);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTipoPlaga && selectedTipoPlaga.id !== undefined) {
      eliminarMutation.mutate(selectedTipoPlaga.id as number, {
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Tipos de Plagas</h2>

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
                  onClick={() => navigate('/cultivo/tipoplaga')} // Cambiar la ruta de navegación
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
        title="Editar Tipo de Plaga"
        onConfirm={() => {
          if (selectedTipoPlaga && selectedTipoPlaga.id !== undefined) {
            actualizarMutation.mutate(
              { id: selectedTipoPlaga.id as number, tipoPlaga: selectedTipoPlaga },
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
          value={selectedTipoPlaga?.nombre || ''}
          onChange={(e) =>
            setSelectedTipoPlaga((prev) => ({
              ...prev!,
              nombre: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={selectedTipoPlaga?.descripcion || ''}
          onChange={(e) =>
            setSelectedTipoPlaga((prev) => ({
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

export default ListaTipoPlagaPage;