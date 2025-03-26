<?php
require_once './config/database.php';
require_once './models/Cultivo/especieModel.php';

class EspecieController {
    private $db;
    private $especie;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->especie = new Especie($this->db);
    }

    public function getTodos() {
        $stmt = $this->especie->getAll();
        $especies = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $especies
        ]);
    }

    public function getPorId($id) {
        $especieData = $this->especie->getById($id);
        if ($especieData) {
            echo json_encode([
                'status' => 200,
                'data' => $especieData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Especie no encontrada'
            ]);
        }
    }

    public function crear($data) {
        $this->especie->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->especie->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;
        $this->especie->tiempo_crecimiento = isset($data['tiempo_crecimiento']) ? $data['tiempo_crecimiento'] : null;
        $this->especie->fk_tipo_especie = isset($data['fk_tipo_especie']) ? $data['fk_tipo_especie'] : null;

        if (!$this->especie->nombre || !$this->especie->fk_tipo_especie) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos requeridos para la especie'
            ]);
            return;
        }

        $newId = $this->especie->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Especie creada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data) {
        $existingEspecie = $this->especie->getById($id);
        if (!$existingEspecie) {
            echo json_encode([
                'status' => 404,
                'message' => 'Especie no encontrada'
            ]);
            return;
        }

        $this->especie->id = $id;
        $this->especie->nombre = isset($data['nombre']) ? $data['nombre'] : $existingEspecie['nombre'];
        $this->especie->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingEspecie['descripcion'];
        $this->especie->tiempo_crecimiento = isset($data['tiempo_crecimiento']) ? $data['tiempo_crecimiento'] : $existingEspecie['tiempo_crecimiento'];
        $this->especie->fk_tipo_especie = isset($data['fk_tipo_especie']) ? $data['fk_tipo_especie'] : $existingEspecie['fk_tipo_especie'];

        if ($this->especie->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Especie actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id) {
        $existingEspecie = $this->especie->getById($id);
        if (!$existingEspecie) {
            echo json_encode([
                'status' => 404,
                'message' => 'Especie no encontrada'
            ]);
            return;
        }

        $this->especie->id = $id;
        if ($this->especie->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Especie eliminada exitosamente'
            ]);
        }
    }
}
?>
