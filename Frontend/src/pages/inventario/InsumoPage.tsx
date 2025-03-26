import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useRegistrarInsumo } from "@/hooks/inventario/useInsumo";
import { ReuInput } from "@/components/globales/ReuInput";
import { useBodegas } from "@/hooks/inventario/useBodega"; // Importa el hook para obtener bodegas

interface Insumo {
  id: number;
  fk_bodega: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

const InsumoPage: React.FC = () => {
  const [insumo, setInsumo] = useState<Insumo>({
    id: 0,
    fk_bodega: 0,
    nombre: "",
    descripcion: "",
    precio: 0,
    cantidad: 0,
  });

  const mutation = useRegistrarInsumo();
  const navigate = useNavigate();
  const { data: bodegas } = useBodegas(); // Obtener la lista de bodegas

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(insumo, {
      onSuccess: () => {
        setInsumo({
          id: 0,
          fk_bodega: 0,
          nombre: "",
          descripcion: "",
          precio: 0,
          cantidad: 0,
        });
      },
    });
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registro de Insumo</h2>
          <form onSubmit={handleSubmit}>
            {/* Campo: Nombre */}
            <ReuInput
              label="Nombre"
              placeholder="Ingrese el nombre"
              type="text"
              value={insumo.nombre}
              onChange={(e) => setInsumo({ ...insumo, nombre: e.target.value })}
            />

            {/* Campo: Descripción */}
            <ReuInput
              label="Descripción"
              placeholder="Ingrese la descripción"
              type="text"
              value={insumo.descripcion}
              onChange={(e) => setInsumo({ ...insumo, descripcion: e.target.value })}
            />

            {/* Campo: Precio */}
            <ReuInput
              label="Precio"
              placeholder="Ingrese el precio"
              type="number"
              value={insumo.precio.toString()}
              onChange={(e) =>
                setInsumo({ ...insumo, precio: Number(e.target.value) })
              }
            />

            {/* Campo: Cantidad */}
            <ReuInput
              label="Cantidad"
              placeholder="Ingrese la cantidad"
              type="number"
              value={insumo.cantidad.toString()}
              onChange={(e) =>
                setInsumo({ ...insumo, cantidad: Number(e.target.value) })
              }
            />

            {/* Campo: Bodega */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bodega</label>
              <select
                value={insumo.fk_bodega || ""}
                onChange={(e) =>
                  setInsumo({ ...insumo, fk_bodega: Number(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Seleccione una bodega</option>
                {bodegas?.map((bodega) => (
                  <option key={bodega.id_bodega} value={bodega.id_bodega}>
                    {bodega.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón: Guardar */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Registrando..." : "Guardar"}
            </button>

            {/* Botón: Listar Insumos */}
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
              onClick={() => navigate("/inventario/listarinsumos/")}
            >
              Listar Insumos
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default InsumoPage;