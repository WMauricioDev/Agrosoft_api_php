import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarCosecha } from "@/hooks/cultivo/usecosecha";
import { useCultivos } from "@/hooks/cultivo/useCultivo";


const CosechaPage: React.FC = () => {
  const [cosecha, setCosecha] = useState({
    fk_cultivo: 0,
    fecha: new Date().toISOString().split('T')[0],
    cantidad: 0
  });

  const mutation = useRegistrarCosecha();
  const navigate = useNavigate();
  const { data: cultivos } = useCultivos();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCosecha(prev => ({
      ...prev,
      [name]: name === "fecha" ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cosecha.fk_cultivo || !cosecha.fecha || cosecha.cantidad <= 0) {
      alert('Todos los campos son requeridos y la cantidad debe ser mayor a 0');
      return;
    }

    mutation.mutate(cosecha, {
      onSuccess: () => {
        navigate('/cultivo/listarcosechas/');
      }
    });
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Registro de Cosecha
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Cultivo</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="fk_cultivo"
                value={cosecha.fk_cultivo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un cultivo</option>
                {cultivos?.map((cultivo) => (
                  <option key={cultivo.id} value={cultivo.id}>
                    {cultivo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <ReuInput
              label="Fecha de Cosecha"
              type="date"
              value={cosecha.fecha}
              onChange={(e) => setCosecha({ ...cosecha, fecha: e.target.value })}
              required
              max={new Date().toISOString().split('T')[0]}
            />

            <ReuInput
              label="Cantidad (kg)"
              placeholder="Ingrese la cantidad cosechada"
              type="number"
              value={cosecha.cantidad.toString()}
              onChange={(e) => setCosecha({ ...cosecha, cantidad: parseInt(e.target.value) })}
              required
              min="1"
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
                onClick={() => navigate("/cultivo/listarcosechas/")}
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

export default CosechaPage;