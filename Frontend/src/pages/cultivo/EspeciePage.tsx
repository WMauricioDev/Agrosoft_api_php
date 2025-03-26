import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarEspecie } from "@/hooks/cultivo/useEspecie";
import { useTipoEspecies } from "@/hooks/cultivo/usetipoespecie";
import { useNavigate } from "react-router-dom";
const EspeciePage: React.FC = () => {
  const [especie, setEspecie] = useState({
    nombre: "",
    descripcion: "",
    tiempo_crecimiento: "",
    fk_tipo_especie: 0,
    img: "",
  });



  const mutation = useRegistrarEspecie();
  const { data: tiposEspecie } = useTipoEspecies();
  const navigate = useNavigate()



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEspecie((prev) => ({
      ...prev,
      [name]: name === "nombre" || name === "descripcion" || name === "img" ? value : Number(value),
    }));
  };




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", especie.nombre);
    formData.append("descripcion", especie.descripcion);
    formData.append("tiempo_crecimiento", especie.tiempo_crecimiento);
    formData.append("fk_tipo_especie", especie.fk_tipo_especie.toString());
    formData.append("img", especie.img);

    mutation.mutate(formData);
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Registro de Especie</h2>

          <ReuInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            type="text"
            value={especie.nombre}
            onChange={(e) => setEspecie({ ...especie, nombre: e.target.value })}
          />

          <ReuInput
            label="Descripción"
            placeholder="Ingrese la descripción"
            type="text"
            value={especie.descripcion}
            onChange={(e) => setEspecie({ ...especie, descripcion: e.target.value })}
          />

          <ReuInput
            label="Largo de Crecimiento"
            placeholder="Ingrese el tiempo en días"
            type="text"
            value={especie.tiempo_crecimiento}
            onChange={(e) => setEspecie({ ...especie, tiempo_crecimiento: e.target.value })}
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Tipo de Especie</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="fk_tipo_especie"
              value={especie.fk_tipo_especie}
              onChange={handleChange}
            >
              <option value="">Seleccione un tipo</option>
              {tiposEspecie?.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))}
            </select>
          </div>

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
            type="submit"
            disabled={mutation.isPending}
            onClick={handleSubmit}
          >
            {mutation.isPending ? "Registrando..." : "Guardar"}
          </button>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listarespecies/")}
          >
            Listar especies
          </button>
        </div>
      </div>

    </DefaultLayout>
  );
};

export default EspeciePage;