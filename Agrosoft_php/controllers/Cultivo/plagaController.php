<?php
require_once './config/database.php';
require_once './models/Cultivo/plagaModel.php';

class PlagaController {
    private $db;
    private $plaga;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->plaga = new Plaga($this->db);
    }

    public function getTodos(){
        $stmt = $this->plaga->getAll();
        $plagas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $plagas
        ]);
    }

    public function getPorId($id){
        $plagaData = $this->plaga->getById($id);
        if ($plagaData) {
            echo json_encode([
                'status' => 200,
                'data' => $plagaData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Plaga no encontrada'
            ]);
        }
    }

    public function crear($data){
        $this->plaga->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->plaga->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;
        $this->plaga->fk_tipo_plaga = isset($data['fk_tipo_plaga']) ? $data['fk_tipo_plaga'] : null;

        if (!$this->plaga->nombre || !$this->plaga->fk_tipo_plaga) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos obligatorios'
            ]);
            return;
        }

        $newId = $this->plaga->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Plaga creada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingPlaga = $this->plaga->getById($id);
        if (!$existingPlaga) {
            echo json_encode([
                'status' => 404,
                'message' => 'Plaga no encontrada'
            ]);
            return;
        }

        $this->plaga->id = $id;
        $this->plaga->nombre = isset($data['nombre']) ? $data['nombre'] : $existingPlaga['nombre'];
        $this->plaga->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingPlaga['descripcion'];
        $this->plaga->fk_tipo_plaga = isset($data['fk_tipo_plaga']) ? $data['fk_tipo_plaga'] : $existingPlaga['fk_tipo_plaga'];

        if ($this->plaga->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Plaga actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingPlaga = $this->plaga->getById($id);
        if (!$existingPlaga) {
            echo json_encode([
                'status' => 404,
                'message' => 'Plaga no encontrada'
            ]);
            return;
        }

        $this->plaga->id = $id;
        if ($this->plaga->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Plaga eliminada exitosamente'
            ]);
        }
    }
}
?>
