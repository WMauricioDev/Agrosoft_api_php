<?php
require_once   './config/database.php';
require_once './models/Inventario/semilleroModel.php';

class SemilleroController {
    private $db;
    private $semillero;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->semillero = new Semillero($this->db);
    }

    public function getTodos() {
        $stmt = $this->semillero->getAll();
        $semilleros = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $semilleros
        ]);
    }

    public function getPorId($id) {
        $semilleroData = $this->semillero->getById($id);
        if ($semilleroData) {
            echo json_encode([
                'status' => 200,
                'data' => $semilleroData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Semillero no encontrado'
            ]);
        }
    }

    public function crear($data) {
        $this->semillero->fk_especie = $data['fk_especie'] ?? null;
        $this->semillero->unidad_medida = $data['unidad_medida'] ?? null;
        $this->semillero->fecha_siembra = $data['fecha_siembra'] ?? null;
        $this->semillero->fecha_estimada = $data['fecha_estimada'] ?? null;

        if (!$this->semillero->fk_especie || !$this->semillero->unidad_medida || !$this->semillero->fecha_siembra) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos requeridos'
            ]);
            return;
        }

        $newId = $this->semillero->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Semillero creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data) {
        $existingSemillero = $this->semillero->getById($id);
        if (!$existingSemillero) {
            echo json_encode([
                'status' => 404,
                'message' => 'Semillero no encontrado'
            ]);
            return;
        }

        $this->semillero->id = $id;
        $this->semillero->fk_especie = $data['fk_especie'] ?? $existingSemillero['fk_especie'];
        $this->semillero->unidad_medida = $data['unidad_medida'] ?? $existingSemillero['unidad_medida'];
        $this->semillero->fecha_siembra = $data['fecha_siembra'] ?? $existingSemillero['fecha_siembra'];
        $this->semillero->fecha_estimada = $data['fecha_estimada'] ?? $existingSemillero['fecha_estimada'];

        if ($this->semillero->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Semillero actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id) {
        $existingSemillero = $this->semillero->getById($id);
        if (!$existingSemillero) {
            echo json_encode([
                'status' => 404,
                'message' => 'Semillero no encontrado'
            ]);
            return;
        }

        $this->semillero->id = $id;
        if ($this->semillero->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Semillero eliminado exitosamente'
            ]);
        }
    }
}
?>
