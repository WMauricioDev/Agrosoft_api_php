export interface Bodega {
  id_bodega?: number; 
  nombre: string;
  ubicacion: string;
  tipo_bodega: "Semillero" | "Cosecha" | "Herramientas"; // Campo enum
}