export interface SensorData {
    id?: number;
    fk_sensor: number;
    temperature: number;
    humidity: number;
    fecha_medicion?: string;
    message?: string;
  }
  