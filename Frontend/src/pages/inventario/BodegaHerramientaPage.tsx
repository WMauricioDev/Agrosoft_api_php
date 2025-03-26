import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { BodegaHerramienta } from "@/types/inventario/BodegaHerramienta";
import { useRegistrarBodegaHerramienta } from "@/hooks/inventario/useBodegaHerramienta";
import { useBodegas } from "@/hooks/inventario/useBodega";
import { useHerramientas } from "@/hooks/inventario/useHerramientas";

const BodegaHerramientaPage: React.FC = () => {
  const [bodegaHerramienta, setBodegaHerramienta] = useState<BodegaHerramienta>({
    id: 0,
    bodega: 0,
    herramienta: 0,
    cantidad: 0,
  });

  const { data: bodegas } = useBodegas();
  const { data: herramientas } = useHerramientas();
  const mutation = useRegistrarBodegaHerramienta();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBodegaHerramienta((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bodegaHerramienta.bodega || !bodegaHerramienta.herramienta) {
      alert("Por favor, selecciona una bodega y una herramienta válidas.");
      return;
    }
    mutation.mutate(bodegaHerramienta, {
      onSuccess: () => {
        setBodegaHerramienta({ id: 0, bodega: 0, herramienta: 0, cantidad: 0 });
        navigate("/inventario/listarbodegaherramienta/");
      },
    });
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registro de Bodega Herramienta</h2>
          <form onSubmit={handleSubmit}>
            <select
              name="bodega"
              value={bodegaHerramienta.bodega}
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
              value={bodegaHerramienta.herramienta}
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
              value={bodegaHerramienta.cantidad}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              placeholder="Cantidad"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Registrando..." : "Guardar"}
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
              onClick={() => navigate("/inventario/listarbodegaherramienta/")}
            >
              Listar Bodega Herramientas
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BodegaHerramientaPage;