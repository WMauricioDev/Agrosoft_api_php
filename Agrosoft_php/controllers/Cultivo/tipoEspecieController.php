<?php
require_once './config/database.php';
require_once './models/Cultivo/tipoEspecieModel.php';
require_once __DIR__ . '/../middleware/middleware.php';

class TipoEspecieController {
    private $db;
    private $tipoEspecie;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tipoEspecie = new TipoEspecie($this->db);
    }

    public function getTodos() {
        $tipoespecie = verificarToken();
        $stmt = $this->tipoEspecie->getAll();
        $especies = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $especies
        ]);
    }

    public function getPorId($id) {
        $tipoespecie = verificarToken();
        $especieData = $this->tipoEspecie->getById($id);
        if ($especieData) {
            echo json_encode([
                'status' => 200,
                'data' => $especieData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de especie no encontrado'
            ]);
        }
    }

    public function crear($data) {
        $tipoespecie = verificarToken();
        $this->tipoEspecie->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->tipoEspecie->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;
        $this->tipoEspecie->img = isset($data['img']) ? $data['img'] : null;

        if (!$this->tipoEspecie->nombre) {
            echo json_encode([
                'status' => 400,
                'message' => 'Falta el nombre del tipo de especie'
            ]);
            return;
        }

        $newId = $this->tipoEspecie->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Tipo de especie creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data) {
        $tipoespecie = verificarToken();
        $existingEspecie = $this->tipoEspecie->getById($id);
        if (!$existingEspecie) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de especie no encontrado'
            ]);
            return;
        }

        $this->tipoEspecie->id = $id;
        $this->tipoEspecie->nombre = isset($data['nombre']) ? $data['nombre'] : $existingEspecie['nombre'];
        $this->tipoEspecie->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingEspecie['descripcion'];
        $this->tipoEspecie->img = isset($data['img']) ? $data['img'] : $existingEspecie['img'];

        if ($this->tipoEspecie->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de especie actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id) {
        $tipoespecie = verificarToken();
        $existingEspecie = $this->tipoEspecie->getById($id);
        if (!$existingEspecie) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de especie no encontrado'
            ]);
            return;
        }

        $this->tipoEspecie->id = $id;
        if ($this->tipoEspecie->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de especie eliminado exitosamente'
            ]);
        }
    }
}
?>
