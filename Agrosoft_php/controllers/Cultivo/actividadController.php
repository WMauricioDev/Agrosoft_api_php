<?php
require_once './config/database.php';
require_once './models/Cultivo/actividadModel.php';

class ActividadController {
    private $db;
    private $actividad;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->actividad = new Actividades($this->db);
    }

    public function getTodos(){
        $tipoActividad = verificarToken();

        $stmt = $this->actividad->getAll();
        $actividades = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $actividades
        ]);
    }

    public function getPorId($id){
        $tipoActividad = verificarToken();

        $actividadData = $this->actividad->getById($id);
        if ($actividadData) {
            echo json_encode([
                'status' => 200,
                'data' => $actividadData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Actividad no encontrada'
            ]);
        }
    }

    public function crear($data){
        $tipoActividad = verificarToken();

        $this->actividad->fk_cultivo = isset($data['fk_cultivo']) ? $data['fk_cultivo'] : null;
        $this->actividad->fk_usuario = isset($data['fk_usuario']) ? $data['fk_usuario'] : null;
        $this->actividad->fk_insumo = isset($data['fk_insumo']) ? $data['fk_insumo'] : null;
        $this->actividad->fk_programacion = isset($data['fk_programacion']) ? $data['fk_programacion'] : null;
        $this->actividad->fk_tipo_actividad = isset($data['fk_tipo_actividad']) ? $data['fk_tipo_actividad'] : null;
        $this->actividad->titulo = isset($data['titulo']) ? $data['titulo'] : null;
        $this->actividad->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;
        $this->actividad->fecha = isset($data['fecha']) ? $data['fecha'] : null;
        $this->actividad->cantidad_producto = isset($data['cantidad_producto']) ? $data['cantidad_producto'] : null;

        if (!$this->actividad->fk_cultivo || !$this->actividad->fk_usuario || !$this->actividad->fk_tipo_actividad || !$this->actividad->titulo) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos obligatorios'
            ]);
            return;
        }

        $newId = $this->actividad->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Actividad creada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $tipoActividad = verificarToken();

        $existingActividad = $this->actividad->getById($id);
        if (!$existingActividad) {
            echo json_encode([
                'status' => 404,
                'message' => 'Actividad no encontrada'
            ]);
            return;
        }

        $this->actividad->id = $id;
        $this->actividad->fk_cultivo = isset($data['fk_cultivo']) ? $data['fk_cultivo'] : $existingActividad['fk_cultivo'];
        $this->actividad->fk_usuario = isset($data['fk_usuario']) ? $data['fk_usuario'] : $existingActividad['fk_usuario'];
        $this->actividad->fk_insumo = isset($data['fk_insumo']) ? $data['fk_insumo'] : $existingActividad['fk_insumo'];
        $this->actividad->fk_programacion = isset($data['fk_programacion']) ? $data['fk_programacion'] : $existingActividad['fk_programacion'];
        $this->actividad->fk_tipo_actividad = isset($data['fk_tipo_actividad']) ? $data['fk_tipo_actividad'] : $existingActividad['fk_tipo_actividad'];
        $this->actividad->titulo = isset($data['titulo']) ? $data['titulo'] : $existingActividad['titulo'];
        $this->actividad->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingActividad['descripcion'];
        $this->actividad->fecha = isset($data['fecha']) ? $data['fecha'] : $existingActividad['fecha'];
        $this->actividad->cantidad_producto = isset($data['cantidad_producto']) ? $data['cantidad_producto'] : $existingActividad['cantidad_producto'];

        if ($this->actividad->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Actividad actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $tipoActividad = verificarToken();

        $existingActividad = $this->actividad->getById($id);
        if (!$existingActividad) {
            echo json_encode([
                'status' => 404,
                'message' => 'Actividad no encontrada'
            ]);
            return;
        }

        $this->actividad->id = $id;
        if ($this->actividad->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Actividad eliminada exitosamente'
            ]);
        }
    }
}
?>