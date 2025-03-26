import React, { useState, FormEvent } from "react";
import DefaultLayout from "@/layouts/default";
import { useSensores, useRegistrarSensor } from "@/hooks/iot/useSensore";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input } from "@heroui/react";

interface Sensor {
  id?: number;
  nombre: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

const ListarSensores: React.FC = () => {
  const { sensores: initialSensores, isLoading, error } = useSensores();
  const [sensores, setSensores] = useState<Sensor[]>(initialSensores || []);
  const mutation = useRegistrarSensor();
  const [newSensor, setNewSensor] = useState<Sensor>({
    nombre: "",
    tipo_sensor: "",
    unidad_medida: "",
    descripcion: "",
    medida_minima: 0,
    medida_maxima: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sincronizar sensores iniciales cuando cambian
  React.useEffect(() => {
    setSensores(initialSensores || []);
  }, [initialSensores]);

  // Manejo de cambios en el formulario de registro
  const handleNewSensorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSensor((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === "medida_minima" || e.target.name === "medida_maxima"
        ? Number(e.target.value)
        : e.target.value,
    }));
  };

  // Registro de un nuevo sensor
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Registrando sensor:", newSensor);
    mutation.mutate(newSensor, {
      onSuccess: (data) => {
        console.log("Sensor registrado con éxito:", data);
        setSensores((prev) => [...prev, { ...newSensor, id: data.id }]); // Actualizar lista localmente
        setNewSensor({
          nombre: "",
          tipo_sensor: "",
          unidad_medida: "",
          descripcion: "",
          medida_minima: 0,
          medida_maxima: 0,
        });
        setErrorMessage(null);
      },
      onError: (err) => {
        console.error("Error al registrar:", err);
        setErrorMessage(`Error al registrar el sensor: ${err.message}`);
      },
    });
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6 bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Lista de Sensores</h2>

          {/* Mensaje de error */}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

          {/* Lista de Sensores */}
          {isLoading ? (
            <p className="text-gray-600 text-center">Cargando sensores...</p>
          ) : error ? (
            <p className="text-red-500 text-center">Error al cargar sensores: {error.message}</p>
          ) : sensores.length === 0 ? (
            <p className="text-gray-600 text-center">No hay sensores registrados.</p>
          ) : (
            <Table aria-label="Lista de sensores">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Tipo</TableColumn>
                <TableColumn>Unidad</TableColumn>
              </TableHeader>
              <TableBody>
                {sensores.map((sensor) => (
                  <TableRow key={sensor.id}>
                    <TableCell>{sensor.id}</TableCell>
                    <TableCell>{sensor.nombre}</TableCell>
                    <TableCell>{sensor.tipo_sensor}</TableCell>
                    <TableCell>{sensor.unidad_medida}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Formulario de Registro */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Registrar Nuevo Sensor</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
              <Input
                label="Nombre"
                name="nombre"
                value={newSensor.nombre}
                onChange={handleNewSensorChange}
                fullWidth
                required
              />
              <Input
                label="Tipo de Sensor"
                name="tipo_sensor"
                value={newSensor.tipo_sensor}
                onChange={handleNewSensorChange}
                fullWidth
                required
              />
              <Input
                label="Unidad de Medida"
                name="unidad_medida"
                value={newSensor.unidad_medida}
                onChange={handleNewSensorChange}
                fullWidth
                required
              />
              <Input
                label="Descripción"
                name="descripcion"
                value={newSensor.descripcion}
                onChange={handleNewSensorChange}
                fullWidth
              />
              <Input
                label="Medida Mínima"
                name="medida_minima"
                type="number"
                value={newSensor.medida_minima.toString()}
                onChange={handleNewSensorChange}
                fullWidth
                required
              />
              <Input
                label="Medida Máxima"
                name="medida_maxima"
                type="number"
                value={newSensor.medida_maxima.toString()}
                onChange={handleNewSensorChange}
                fullWidth
                required
              />
              <Button
                type="submit"
                color="primary"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? "Registrando..." : "Guardar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ListarSensores;