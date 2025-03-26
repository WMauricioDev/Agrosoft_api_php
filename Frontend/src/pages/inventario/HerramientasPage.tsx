import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useRegistrarHerramienta } from "@/hooks/inventario/useHerramientas";
import { ReuInput } from "@/components/globales/ReuInput";
import { useBodegas } from "@/hooks/inventario/useBodega";

interface Herramienta {
  id: number;
  fk_bodega: number;
  nombre: string;
  descripcion: string;
  unidades: number;
}

const HerramientaPage: React.FC = () => {
  const [herramienta, setHerramienta] = useState<Herramienta>({
    id: 0,
    fk_bodega: 0,
    nombre: "",
    descripcion: "",
    unidades: 0,
  });

  const mutation = useRegistrarHerramienta();
  const navigate = useNavigate();
  const { data: bodega } = useBodegas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(herramienta, {
      onSuccess: () => {
        setHerramienta({
          id: 0,
          fk_bodega: 0,
          nombre: "",
          descripcion: "",
          unidades: 0,
        });
      },
    });
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registro de Herramienta</h2>
          <form onSubmit={handleSubmit}>
            <ReuInput
              label="Nombre"
              placeholder="Ingrese el nombre"
              type="text"
              value={herramienta.nombre}
              onChange={(e) =>
                setHerramienta({ ...herramienta, nombre: e.target.value })
              }
            />
            <ReuInput
              label="Descripción"
              placeholder="Ingrese la descripción"
              type="text"
              value={herramienta.descripcion}
              onChange={(e) =>
                setHerramienta({ ...herramienta, descripcion: e.target.value })
              }
            />
            <ReuInput
              label="Cantidad"
              placeholder="Ingrese la cantidad"
              type="number"
              value={herramienta.unidades.toString()}
              onChange={(e) =>
                setHerramienta({
                  ...herramienta,
                  unidades: Number(e.target.value),
                })
              }
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Bodega</label>
            <select
              name="fk_bodega"
              value={herramienta.fk_bodega || ""}
              onChange={(e) =>
                setHerramienta({
                  ...herramienta,
                  fk_bodega: Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Seleccione una bodega</option>
              {bodega?.map((bodegas) => (
                <option key={bodegas.id_bodega} value={bodegas.id_bodega}>
                  {bodegas.nombre}
                </option>
              ))}
            </select>

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
              onClick={() => navigate("/inventario/listarherramientas/")}
            >
              Listar Herramientas
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HerramientaPage;