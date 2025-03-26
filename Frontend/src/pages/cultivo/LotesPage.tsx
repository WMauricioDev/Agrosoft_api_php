import React, { useState } from "react"; 
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { useRegistrarLote } from "../../hooks/cultivo/uselotes";
import { Lote } from "../../types/cultivo/Lotes";
import Formulario from "../../components/globales/Formulario";
import { useNavigate } from "react-router-dom";

const LotesPage: React.FC = () => {
  const [lote, setLote] = useState<Lote>({
    nombre: "",
    descripcion: "",
    estado: "activo",
    tamx: 0,
    tamy: 0,
    posx: 0,
    posy: 0,
  });

  const mutation = useRegistrarLote();
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <Formulario title="Registro de Lote">
            <ReuInput
              label="Nombre"
              placeholder="Ingrese el nombre"
              type="text"
              value={lote.nombre}
              onChange={(e) => setLote({ ...lote, nombre: e.target.value })}
            />

            <ReuInput
              label="Descripción"
              placeholder="Ingrese la descripción"
              type="text"
              value={lote.descripcion}
              onChange={(e) => setLote({ ...lote, descripcion: e.target.value })}
            />

            <label className="text-gray-700 font-medium">Estado</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={lote.estado}
              onChange={(e) => setLote({ ...lote, estado: e.target.value })}
            >
              <option value="activo">Activo</option>
              <option value="ocupado">Ocupado</option>
              <option value="en proceso de adecuamiento">En proceso de adecuamiento</option>
            </select>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <ReuInput
                label="Tamaño X"
                placeholder="Ingrese tamaño X"
                type="number"
                value={lote.tamx.toString()}
                onChange={(e) => setLote({ ...lote, tamx: parseFloat(e.target.value) })}
              />

              <ReuInput
                label="Tamaño Y"
                placeholder="Ingrese tamaño Y"
                type="number"
                value={lote.tamy.toString()}
                onChange={(e) => setLote({ ...lote, tamy: parseFloat(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ReuInput
                label="Posición X"
                placeholder="Ingrese posición X"
                type="number"
                value={lote.posx.toString()}
                onChange={(e) => setLote({ ...lote, posx: parseFloat(e.target.value) })}
              />

              <ReuInput
                label="Posición Y"
                placeholder="Ingrese posición Y"
                type="number"
                value={lote.posy.toString()}
                onChange={(e) => setLote({ ...lote, posy: parseFloat(e.target.value) })}
              />
            </div>

            <button
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
              type="submit"
              disabled={mutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                mutation.mutate(lote);
              }}
            >
              {mutation.isPending ? "Registrando..." : "Guardar"}
            </button>
          </Formulario>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listarlotes/")}
          >
            Listar lotes
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LotesPage;
