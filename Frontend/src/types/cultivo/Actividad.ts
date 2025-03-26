export interface Actividad {
    id?: number;
    fk_cultivo: number;
    fk_usuario: number;
    fk_insumo: number | null;
    fk_programacion: number | null;
    fk_tipo_actividad: number;
    titulo: string;
    descripcion: string | null;
    fecha: string; // o Date si prefieres usar objetos Date
    cantidad_producto: number | null;
}

// Tipo para la creación de actividad (sin el id)
export type CrearActividad = Omit<Actividad, 'id'>;

// Tipo para actualizar actividad (todos los campos opcionales excepto el id)
export type ActualizarActividad = Partial<Omit<Actividad, 'id'>> & { id: number };

// Tipo para los datos que se muestran en la lista (puede incluir relaciones)
export interface ActividadLista extends Omit<Actividad, 'fk_cultivo' | 'fk_usuario' | 'fk_insumo' | 'fk_programacion' | 'fk_tipo_actividad'> {
    cultivo?: string;
    usuario?: string;
    insumo?: string;
    programacion?: string;
    tipo_actividad?: string;
}