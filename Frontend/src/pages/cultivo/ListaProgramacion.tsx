import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { Programacion } from '../../types/cultivo/Programacion';
import { useProgramaciones, useActualizarProgramacion, useEliminarProgramacion } from '../../hooks/cultivo/useProgramacion';
import ReuModal from '../../components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla';

const ListaProgramacionPage: React.FC = () => {
  const [selectedProgramacion, setSelectedProgramacion] = useState<Programacion | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: programaciones, isLoading, refetch } = useProgramaciones();
  const actualizarMutation = useActualizarProgramacion();
  const eliminarMutation = useEliminarProgramacion();
  const navigate = useNavigate();

  const columns = [
    { name: 'Ubicación', uid: 'ubicacion' },
    { name: 'Estado', uid: 'estado' },
    { name: 'Fecha Programada', uid: 'fecha_prog' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (programacion: Programacion) => {
    setSelectedProgramacion(programacion);
    setIsEditModalOpen(true);
  };

  const handleDelete = (programacion: Programacion) => {
    setSelectedProgramacion(programacion);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProgramacion && selectedProgramacion.id_programacion !== undefined) {
      eliminarMutation.mutate(selectedProgramacion.id_programacion, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (programaciones ?? []).map((programacion) => ({
    id: programacion.id_programacion?.toString() || '',
    ubicacion: programacion.ubicacion,
    estado: programacion.estado,
    fecha_prog: programacion.fecha_prog ? new Date(programacion.fecha_prog).toLocaleDateString() : 'Sin fecha',
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(programacion)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(programacion)}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Programaciones</h2>

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
                  onClick={() => navigate('/cultivo/programacion')}
                >
                  Registrar Programación
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Programación"
        onConfirm={() => {
          if (selectedProgramacion && selectedProgramacion.id_programacion !== undefined) {
            actualizarMutation.mutate(
              { 
                id: selectedProgramacion.id_programacion, 
                programacion: selectedProgramacion 
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
        <ReuInput
          label="Ubicación"
          placeholder="Ingrese la ubicación"
          type="text"
          value={selectedProgramacion?.ubicacion || ''}
          onChange={(e) =>
            setSelectedProgramacion((prev) => ({
              ...prev!,
              ubicacion: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Estado"
          placeholder="Ingrese el estado"
          type="text"
          value={selectedProgramacion?.estado || ''}
          onChange={(e) =>
            setSelectedProgramacion((prev) => ({
              ...prev!,
              estado: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Fecha Programada"
          placeholder="Seleccione la fecha"
          type="date"
          value={selectedProgramacion?.fecha_prog ? new Date(selectedProgramacion.fecha_prog).toISOString().split('T')[0] : ''}
          onChange={(e) =>
            setSelectedProgramacion((prev) => ({
              ...prev!,
              fecha_prog: e.target.value,
            }))
          }
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar esta programación?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaProgramacionPage;