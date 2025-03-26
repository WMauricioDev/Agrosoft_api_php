<?php
require_once './config/database.php';
require_once './models/Cultivo/cultivoModel.php';

class CultivoController {
    private $db;
    private $cultivo;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->cultivo = new Cultivo($this->db);
    }

    public function getTodos() {
        $stmt = $this->cultivo->getAll();
        $cultivos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $cultivos
        ]);
    }

    public function getPorId($id) {
        $cultivoData = $this->cultivo->getById($id);
        if ($cultivoData) {
            echo json_encode([
                'status' => 200,
                'data' => $cultivoData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Cultivo no encontrado'
            ]);
        }
    }

    public function crear($data) {
        $this->cultivo->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->cultivo->unidad_de_medida = isset($data['unidad_de_medida']) ? $data['unidad_de_medida'] : null;
        $this->cultivo->estado = isset($data['estado']) ? $data['estado'] : null;
        $this->cultivo->fecha_siembra = isset($data['fecha_siembra']) ? $data['fecha_siembra'] : null;
        $this->cultivo->fk_especie = isset($data['fk_especie']) ? $data['fk_especie'] : null;

        if (!$this->cultivo->nombre || !$this->cultivo->estado || !$this->cultivo->fk_especie) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos obligatorios del cultivo'
            ]);
            return;
        }

        $newId = $this->cultivo->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Cultivo creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data) {
        $existingCultivo = $this->cultivo->getById($id);
        if (!$existingCultivo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Cultivo no encontrado'
            ]);
            return;
        }

        $this->cultivo->id = $id;
        $this->cultivo->nombre = isset($data['nombre']) ? $data['nombre'] : $existingCultivo['nombre'];
        $this->cultivo->unidad_de_medida = isset($data['unidad_de_medida']) ? $data['unidad_de_medida'] : $existingCultivo['unidad_de_medida'];
        $this->cultivo->estado = isset($data['estado']) ? $data['estado'] : $existingCultivo['estado'];
        $this->cultivo->fecha_siembra = isset($data['fecha_siembra']) ? $data['fecha_siembra'] : $existingCultivo['fecha_siembra'];
        $this->cultivo->fk_especie = isset($data['fk_especie']) ? $data['fk_especie'] : $existingCultivo['fk_especie'];

        if ($this->cultivo->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Cultivo actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id) {
        $existingCultivo = $this->cultivo->getById($id);
        if (!$existingCultivo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Cultivo no encontrado'
            ]);
            return;
        }

        $this->cultivo->id = $id;
        if ($this->cultivo->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Cultivo eliminado exitosamente'
            ]);
        }
    }
}
?>