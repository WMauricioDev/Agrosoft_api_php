import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { Programacion } from "@/types/cultivo/Programacion";
import { useRegistrarProgramacion } from "@/hooks/cultivo/useProgramacion";

const ProgramacionPage: React.FC = () => {
  const [programacion, setProgramacion] = useState<Programacion>({
    ubicacion: "",
    estado: "pendiente", 
    fecha_prog: new Date().toISOString().split('T')[0] 
  });

  const mutation = useRegistrarProgramacion();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!programacion.ubicacion || !programacion.fecha_prog) {
      alert('Ubicación y fecha son campos requeridos');
      return;
    }

    mutation.mutate(programacion, {
      onSuccess: () => {
        navigate('/cultivo/listarprogramaciones/');
      }
    });
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Registro de Programación
          </h2>

          <form onSubmit={handleSubmit}>
            <ReuInput
              label="Ubicación"
              placeholder="Ingrese la ubicación"
              type="text"
              value={programacion.ubicacion}
              onChange={(e) => 
                setProgramacion({ ...programacion, ubicacion: e.target.value })
              }
            />

            <ReuInput
              label="Estado"
              placeholder="Seleccione el estado"
              type="select"
              value={programacion.estado}
              onChange={(e) => 
                setProgramacion({ ...programacion, estado: e.target.value })
              }
              options={[
                { value: "pendiente", label: "Pendiente" },
                { value: "completado", label: "Completado" },
                { value: "cancelado", label: "Cancelado" }
              ]}
              required
            />

            <ReuInput
              label="Fecha Programada"
              type="date"
              value={programacion.fecha_prog}
              onChange={(e) => 
                setProgramacion({ ...programacion, fecha_prog: e.target.value })
              }
            />

            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Registrando..." : "Guardar"}
              </button>

              <button
                type="button"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => navigate("/cultivo/listarprogramaciones/")}
              >
                Ver Listado
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProgramacionPage;