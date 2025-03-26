<?php
require_once   './config/database.php';
require_once './models/Cultivo/afeccionesModel.php';

class AfeccionesController {
    private $db;
    private $afeccion;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->afeccion = new Afeccion($this->db);
    }

    public function getTodos(){
        $stmt = $this->afeccion->getAll();
        $afecciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $afecciones
        ]);
    }

    public function getPorId($id){
        $afeccionData = $this->afeccion->getById($id);
        if ($afeccionData) {
            echo json_encode([
                'status' => 200,
                'data' => $afeccionData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Afección no encontrada'
            ]);
        }
    }

    public function crear($data){
        $this->afeccion->prioridad = isset($data['prioridad']) ? $data['prioridad'] : null;
        $this->afeccion->fecha_encuentro = isset($data['fecha_encuentro']) ? $data['fecha_encuentro'] : null;
        $this->afeccion->fk_plantacion = isset($data['fk_plantacion']) ? $data['fk_plantacion'] : null;
        $this->afeccion->fk_plaga = isset($data['fk_plaga']) ? $data['fk_plaga'] : null;

        if (!$this->afeccion->prioridad || !$this->afeccion->fecha_encuentro || !$this->afeccion->fk_plantacion || !$this->afeccion->fk_plaga) {
            echo json_encode([
                'status' => 400,
                'message' => 'Todos los campos son obligatorios'
            ]);
            return;
        }

        $newId = $this->afeccion->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Afección creada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingAfeccion = $this->afeccion->getById($id);
        if (!$existingAfeccion) {
            echo json_encode([
                'status' => 404,
                'message' => 'Afección no encontrada'
            ]);
            return;
        }

        $this->afeccion->id = $id;
        $this->afeccion->prioridad = isset($data['prioridad']) ? $data['prioridad'] : $existingAfeccion['prioridad'];
        $this->afeccion->fecha_encuentro = isset($data['fecha_encuentro']) ? $data['fecha_encuentro'] : $existingAfeccion['fecha_encuentro'];
        $this->afeccion->fk_plantacion = isset($data['fk_plantacion']) ? $data['fk_plantacion'] : $existingAfeccion['fk_plantacion'];
        $this->afeccion->fk_plaga = isset($data['fk_plaga']) ? $data['fk_plaga'] : $existingAfeccion['fk_plaga'];

        if ($this->afeccion->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Afección actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingAfeccion = $this->afeccion->getById($id);
        if (!$existingAfeccion) {
            echo json_encode([
                'status' => 404,
                'message' => 'Afección no encontrada'
            ]);
            return;
        }

        $this->afeccion->id = $id;
        if ($this->afeccion->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Afección eliminada exitosamente'
            ]);
        }
    }
}
?>