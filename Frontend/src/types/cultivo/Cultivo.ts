export interface Cultivo {
  id?: number;
  fk_especie: number; 
  fk_bancal: number; 
  nombre: string;
  unidad_de_medida?: number;
  estado: string;
  fecha_siembra: string; 
}