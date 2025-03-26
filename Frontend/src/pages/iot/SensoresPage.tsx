import React from "react";
import { useDatosMeteorologicos } from "@/hooks/iot/useDatosMeteorologicos";
import { SensorData } from "@/types/iot/type";
import DefaultLayout from "@/layouts/default";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function SensoresPage() {
  const { data: latestData = [], chartData = [], isLoading, error } = useDatosMeteorologicos();

  const fallbackData: SensorData[] = error || latestData.length === 0
    ? [{
        fk_sensor: 1,
        temperature: 0,
        humidity: 0,
        message: error ? "Error al conectar con el sensor" : "Esperando datos del sensor...",
      }]
    : [];

  const displayData = latestData.length > 0 ? latestData : fallbackData;

  const graphData = chartData.map((sensor, index) => ({
    name: sensor.fecha_medicion
      ? new Date(sensor.fecha_medicion).toLocaleTimeString()
      : `Dato ${index + 1}`,
    temperature: sensor.temperature,
    humidity: sensor.humidity,
    sensorId: sensor.fk_sensor,
  }));

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6 bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-700">Sensores Activos en Tiempo Real</h1>
            <div className="space-x-4">
              <Link
                to="/iot/datosmetereologicos"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ver Datos Históricos
              </Link>
              <Link
                to="/iot/listar-sensores"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Sensores
              </Link>
            </div>
          </div>
          {isLoading ? (
            <p className="text-gray-600 text-center">Cargando datos de sensores...</p>
          ) : (
            <>
              {error && (
                <div className="text-center text-red-500 mb-4">
                  Error: {error.message}
                </div>
              )}
              <div className="w-full mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Gráfica en Tiempo Real</h2>
                <LineChart
                  width={600}
                  height={300}
                  data={graphData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#8884d8"
                    name="Temperatura (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#82ca9d"
                    name="Humedad (%)"
                  />
                </LineChart>
              </div>
              <div className="overflow-x-auto">
                <Table aria-label="Datos en tiempo real">
                  <TableHeader>
                    <TableColumn>IDENTIFICACIÓN</TableColumn>
                    <TableColumn>Identificación del sensor</TableColumn>
                    <TableColumn>Temperatura (°C)</TableColumn>
                    <TableColumn>Humedad (%)</TableColumn>
                    <TableColumn>Fecha de Medición</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {displayData.map((sensor: SensorData, index: number) => (
                      <TableRow key={sensor.id ?? `sensor-${index}`}>
                        <TableCell>{sensor.id ?? "N/A"}</TableCell>
                        <TableCell>{sensor.fk_sensor}</TableCell>
                        <TableCell>{sensor.temperature}</TableCell>
                        <TableCell>{sensor.humidity}</TableCell>
                        <TableCell>
                          {sensor.fecha_medicion
                            ? new Date(sensor.fecha_medicion).toLocaleString()
                            : sensor.message || "En tiempo real"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}