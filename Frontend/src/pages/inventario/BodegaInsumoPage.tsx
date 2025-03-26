import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { BodegaInsumo } from "@/types/inventario/BodegaInsumo";
import { useRegistrarBodegaInsumo } from "@/hooks/inventario/useBodegaInsumo";
import { useBodegas } from "@/hooks/inventario/useBodega";
import { useInsumos } from "@/hooks/inventario/useInsumo";
import { Insumo } from "@/types/inventario/Insumo";

const BodegaInsumoPage: React.FC = () => {
  const [bodegaInsumo, setBodegaInsumo] = useState<BodegaInsumo>({
    id: 0,
    bodega: 0,
    insumo: 0,
    cantidad: 0,
  });

  const { data: bodegas } = useBodegas();
  const { data: insumos } = useInsumos();
  const mutation = useRegistrarBodegaInsumo();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBodegaInsumo((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(bodegaInsumo, {
      onSuccess: () => {
        setBodegaInsumo({ id: 0, bodega: 0, insumo: 0, cantidad: 0 });
        navigate("/inventario/listarbodegainsumos/");
      },
    });
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registro de Bodega Insumo</h2>
          <form onSubmit={handleSubmit}>
            <select
              name="bodega"
              value={bodegaInsumo.bodega}
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
              value={bodegaInsumo.insumo}
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
              value={bodegaInsumo.cantidad}
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
              onClick={() => navigate("/inventario/listarbodegainsumos/")}
            >
              Listar Bodega Insumos
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BodegaInsumoPage;