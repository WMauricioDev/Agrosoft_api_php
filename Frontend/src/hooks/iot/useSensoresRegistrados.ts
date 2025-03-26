import { useState, useEffect } from "react";

interface Sensor {
  id: number;
  nombre: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

export const useSensoresRegistrados = () => {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchSensores = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/iot/sensores/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const result: Sensor[] = await response.json();
        setSensores(result);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"));
        setIsLoading(false);
      }
    };

    if (token) {
      fetchSensores();
    } else {
      setError(new Error("No autenticado"));
      setIsLoading(false);
    }
  }, [token]);

  return { sensores, isLoading, error };
};