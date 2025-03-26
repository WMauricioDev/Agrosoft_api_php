import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useRegistrarBodega } from "@/hooks/inventario/useBodega";
import { ReuInput } from "@/components/globales/ReuInput";

interface Bodega {
  id_bodega?: number; // Opcional porque es autoincremental
  nombre: string;
  ubicacion: string;
  tipo_bodega: "Semillero" | "Cosecha" | "Herramientas"; // Campo enum
}

const BodegaPage: React.FC = () => {
  const [bodega, setBodega] = useState<Bodega>({
    nombre: "",
    ubicacion: "",
    tipo_bodega: "Semillero", // Valor por defecto
  });

  const mutation = useRegistrarBodega();
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registro de Bodega</h2>

          {/* Campo: Nombre */}
          <ReuInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            type="text"
            value={bodega.nombre}
            onChange={(e) => setBodega({ ...bodega, nombre: e.target.value })}
          />

          {/* Campo: Ubicación */}
          <ReuInput
            label="Ubicación"
            placeholder="Ingrese la ubicación"
            type="text"
            value={bodega.ubicacion}
            onChange={(e) => setBodega({ ...bodega, ubicacion: e.target.value })}
          />

          {/* Campo: Tipo de Bodega */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Bodega
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={bodega.tipo_bodega}
              onChange={(e) =>
                setBodega({
                  ...bodega,
                  tipo_bodega: e.target.value as "Semillero" | "Cosecha" | "Herramientas",
                })
              }
            >
              <option value="Semillero">Semillero</option>
              <option value="Cosecha">Cosecha</option>
              <option value="Herramientas">Herramientas</option>
            </select>
          </div>

          {/* Botón: Guardar */}
          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
            type="submit"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate(bodega, {
                onSuccess: () => {
                  // Limpiar el formulario después de guardar
                  setBodega({
                    nombre: "",
                    ubicacion: "",
                    tipo_bodega: "Semillero", // Restablecer al valor por defecto
                  });
                },
              });
            }}
          >
            {mutation.isPending ? "Registrando..." : "Guardar"}
          </button>

          {/* Botón: Listar Bodegas */}
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/inventario/listarbodega/")}
          >
            Listar Bodegas
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BodegaPage;