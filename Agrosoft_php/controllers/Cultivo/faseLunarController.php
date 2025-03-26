<?php
require_once   './config/database.php';
require_once './models/Cultivo/faseLunarModel.php';

class FaseLunarController {
    private $db;
    private $faseLunar;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->faseLunar = new FaseLunar($this->db);
    }

    public function getTodos() {
        $stmt = $this->faseLunar->getAll();
        $fases = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $fases
        ]);
    }

    public function getPorId($id) {
        $faseData = $this->faseLunar->getById($id);
        if ($faseData) {
            echo json_encode([
                'status' => 200,
                'data' => $faseData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Fase lunar no encontrada'
            ]);
        }
    }

    public function crear($data) {
        $this->faseLunar->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->faseLunar->descripcion = $data['descripcion'] ?? null;
        $this->faseLunar->fecha = $data['fecha'] ?? null;

        if (!$this->faseLunar->nombre || !$this->faseLunar->fecha) {
            echo json_encode([
                'status' => 400,
                'message' => 'Falta el nombre o la fecha de la fase lunar'
            ]);
            return;
        }

        $newId = $this->faseLunar->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Fase lunar creada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data) {
        $existingFase = $this->faseLunar->getById($id);
        if (!$existingFase) {
            echo json_encode([
                'status' => 404,
                'message' => 'Fase lunar no encontrada'
            ]);
            return;
        }

        $this->faseLunar->id = $id;
        $this->faseLunar->nombre = $data['nombre'] ?? $existingFase['nombre'];
        $this->faseLunar->descripcion = $data['descripcion'] ?? $existingFase['descripcion'];
        $this->faseLunar->fecha = $data['fecha'] ?? $existingFase['fecha'];

        if ($this->faseLunar->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Fase lunar actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id) {
        $existingFase = $this->faseLunar->getById($id);
        if (!$existingFase) {
            echo json_encode([
                'status' => 404,
                'message' => 'Fase lunar no encontrada'
            ]);
            return;
        }

        $this->faseLunar->id = $id;
        if ($this->faseLunar->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Fase lunar eliminada exitosamente'
            ]);
        }
    }
}
?>