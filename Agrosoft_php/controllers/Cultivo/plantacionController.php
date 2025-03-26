<?php
require_once   './config/database.php';
require_once './models/Cultivo/plantacionModel.php';

class PlantacionController {
    private $db;
    private $plantacion;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->plantacion = new Plantacion($this->db);
    }

    public function getTodos(){
        $stmt = $this->plantacion->getAll();
        $plantaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $plantaciones
        ]);
    }

    public function getPorId($id){
        $plantacionData = $this->plantacion->getById($id);
        if ($plantacionData) {
            echo json_encode([
                'status' => 200,
                'data' => $plantacionData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Plantación no encontrada'
            ]);
        }
    }

    public function crear($data){
        $this->plantacion->fk_cultivo = isset($data['fk_cultivo']) ? $data['fk_cultivo'] : null;
        $this->plantacion->fk_bancal = isset($data['fk_bancal']) ? $data['fk_bancal'] : null;

        if (!$this->plantacion->fk_cultivo || !$this->plantacion->fk_bancal) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos obligatorios (fk_cultivo, fk_bancal)'
            ]);
            return;
        }

        $newId = $this->plantacion->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Plantación creada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingPlantacion = $this->plantacion->getById($id);
        if (!$existingPlantacion) {
            echo json_encode([
                'status' => 404,
                'message' => 'Plantación no encontrada'
            ]);
            return;
        }

        $this->plantacion->id = $id;
        $this->plantacion->fk_cultivo = isset($data['fk_cultivo']) ? $data['fk_cultivo'] : $existingPlantacion['fk_cultivo'];
        $this->plantacion->fk_bancal = isset($data['fk_bancal']) ? $data['fk_bancal'] : $existingPlantacion['fk_bancal'];

        if ($this->plantacion->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Plantación actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingPlantacion = $this->plantacion->getById($id);
        if (!$existingPlantacion) {
            echo json_encode([
                'status' => 404,
                'message' => 'Plantación no encontrada'
            ]);
            return;
        }

        $this->plantacion->id = $id;
        if ($this->plantacion->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Plantación eliminada exitosamente'
            ]);
        }
    }
}
?>
