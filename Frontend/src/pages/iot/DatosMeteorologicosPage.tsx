import { useState, useMemo } from "react";
import DefaultLayout from "@/layouts/default";
import { useDatosMeteorologicosHistoricos } from "../../hooks/iot/useDatosMeteorologicosHistoricos";
import { useSensoresRegistrados } from "../../hooks/iot/useSensoresRegistrados";
import { SensorData } from "../../types/iot/type";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Link } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Datos simulados de 200 registros (solo para demostración)
const generateMockData = (): SensorData[] => {
  const mockData: SensorData[] = [];
  for (let i = 1; i <= 200; i++) {
    mockData.push({
      id: i,
      fk_sensor: Math.floor(Math.random() * 5) + 1, // Sensores del 1 al 5
      temperature: Math.random() * 40, // Temperatura entre 0 y 40
      humidity: Math.random() * 100, // Humedad entre 0 y 100
      fecha_medicion: new Date(Date.now() - i * 3600000).toISOString(), // Últimas 200 horas
    });
  }
  return mockData;
};

export default function DatosMeteorologicosPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Usamos datos reales del hook, pero simulamos 200 si quieres probar sin backend
  const { data: historicos = generateMockData(), isLoading, error } = useDatosMeteorologicosHistoricos(0, "");
  const { sensores, isLoading: sensoresLoading, error: sensoresError } = useSensoresRegistrados();

  const filteredHistoricos = useMemo(() => {
    let result = [...historicos];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const hasColon = lowerSearch.includes(":");
      const hasSlash = lowerSearch.includes("/");
      const hasDot = lowerSearch.includes(".");

      result = result.filter((dato) => {
        const sensor = sensores.find((s) => s.id === dato.fk_sensor);
        const sensorName = sensor ? sensor.nombre.toLowerCase() : "";
        const fechaStr = dato.fecha_medicion ? new Date(dato.fecha_medicion).toLocaleString() : "N/A";
        const fkSensorStr = String(dato.fk_sensor || "");
        const tempStr = String(dato.temperature ?? "");
        const humStr = dato.humidity !== null && dato.humidity !== undefined ? String(dato.humidity) : "";

        if (hasColon) return fechaStr.toLowerCase().includes(lowerSearch);
        if (hasSlash) return fechaStr.toLowerCase().includes(lowerSearch);
        if (hasDot) return tempStr.includes(lowerSearch) || (humStr && humStr.includes(lowerSearch));
        const searchStart = lowerSearch.slice(0, 3);
        const nameStart = sensorName.slice(0, 3);
        return fkSensorStr === lowerSearch || (sensorName && nameStart.startsWith(searchStart));
      });
    }
    return result;
  }, [historicos, searchTerm, sensores]);

  const totalPages = Math.ceil(filteredHistoricos.length / itemsPerPage);
  const paginatedHistoricos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredHistoricos.slice(start, end);
  }, [filteredHistoricos, currentPage, itemsPerPage]);

  const chartData = paginatedHistoricos.map((dato) => ({
    name: dato.fecha_medicion ? new Date(dato.fecha_medicion).toLocaleTimeString() : "N/A",
    temperature: dato.temperature ?? null,
    humidity: dato.humidity ?? null,
  }));

  // Funciones de paginación sin límite
  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  console.log("Rendering pagination - Current page:", currentPage, "Total pages:", totalPages);

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6 bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-700">Datos Meteorológicos Guardados</h1>
            <Link to="/iot/sensores" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Volver a Tiempo Real
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-700">Todos los datos históricos</h2>
            <div className="w-64">
              <TextField
                label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="ID, nombre, fecha (15/), hora (12:), temp/hum (26.)"
              />
            </div>
          </div>

          {isLoading || sensoresLoading ? (
            <p className="text-gray-600 text-center">Cargando datos históricos...</p>
          ) : error ? (
            <div className="text-center text-red-500">Error al cargar datos: {error.message}</div>
          ) : sensoresError ? (
            <div className="text-center text-red-500">Error al cargar sensores: {sensoresError.message}</div>
          ) : historicos.length === 0 ? (
            <p className="text-gray-600 text-center">No hay datos históricos disponibles.</p>
          ) : (
            <>
              <div className="w-full mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Gráfica de Datos Históricos</h2>
                {paginatedHistoricos.length === 0 ? (
                  <p className="text-gray-600 text-center">
                    {currentPage > totalPages ? "No hay más datos disponibles." : `No hay datos para el filtro "${searchTerm}".`}
                  </p>
                ) : (
                  <LineChart width={600} height={300} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperatura (°C)" connectNulls />
                    <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humedad (%)" connectNulls />
                  </LineChart>
                )}
              </div>
              {filteredHistoricos.length === 0 ? (
                <p className="text-gray-600 text-center">No hay datos para el filtro "{searchTerm}".</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table aria-label="Datos meteorológicos históricos">
                      <TableHeader>
                        <TableColumn>IDENTIFICACIÓN</TableColumn>
                        <TableColumn>ID del Sensor</TableColumn>
                        <TableColumn>Nombre del Sensor</TableColumn>
                        <TableColumn>Temperatura (°C)</TableColumn>
                        <TableColumn>Humedad (%)</TableColumn>
                        <TableColumn>Fecha de Medición</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {paginatedHistoricos.map((dato: SensorData) => {
                          const sensor = sensores.find((s) => s.id === dato.fk_sensor);
                          return (
                            <TableRow key={dato.id || `${dato.fk_sensor}-${dato.fecha_medicion}`}>
                              <TableCell>{dato.id || "N/A"}</TableCell>
                              <TableCell>{dato.fk_sensor || "N/A"}</TableCell>
                              <TableCell>{sensor ? sensor.nombre : "N/A"}</TableCell>
                              <TableCell>{dato.temperature ?? "N/A"}</TableCell>
                              <TableCell>{dato.humidity ?? "N/A"}</TableCell>
                              <TableCell>
                                {dato.fecha_medicion ? new Date(dato.fecha_medicion).toLocaleString() : "N/A"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  {totalPages > 0 && (
                    <div className="flex justify-center mt-4 gap-4" key={currentPage}>
                      <Button variant="outlined" onClick={handlePrevPage} disabled={currentPage === 1}>
                        ← Anterior
                      </Button>
                      <span className="self-center text-gray-700">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button variant="outlined" onClick={handleNextPage}>
                        Siguiente →
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}