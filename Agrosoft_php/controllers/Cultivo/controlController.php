<?php
require_once './config/database.php';
require_once './models/Cultivo/controlModel.php';

class ControlController {
    private $db;
    private $control;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->control = new Control($this->db);
    }

    public function getTodos(){
        $stmt = $this->control->getAll();
        $controles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $controles
        ]);
    }

    public function getPorId($id){
        $controlData = $this->control->getById($id);
        if ($controlData) {
            echo json_encode([
                'status' => 200,
                'data' => $controlData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Control no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->control->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;
        $this->control->fecha_control = isset($data['fecha_control']) ? $data['fecha_control'] : null;
        $this->control->cantidad_producto = isset($data['cantidad_producto']) ? $data['cantidad_producto'] : null;
        $this->control->fk_afecciones = isset($data['fk_afecciones']) ? $data['fk_afecciones'] : null;
        $this->control->fk_tipo_control = isset($data['fk_tipo_control']) ? $data['fk_tipo_control'] : null;
        $this->control->fk_productos_control = isset($data['fk_productos_control']) ? $data['fk_productos_control'] : null;

        if (!$this->control->descripcion || !$this->control->fecha_control || !$this->control->cantidad_producto || !$this->control->fk_afecciones || !$this->control->fk_tipo_control || !$this->control->fk_productos_control) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos obligatorios'
            ]);
            return;
        }

        $newId = $this->control->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Control creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingControl = $this->control->getById($id);
        if (!$existingControl) {
            echo json_encode([
                'status' => 404,
                'message' => 'Control no encontrado'
            ]);
            return;
        }

        $this->control->id = $id;
        $this->control->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingControl['descripcion'];
        $this->control->fecha_control = isset($data['fecha_control']) ? $data['fecha_control'] : $existingControl['fecha_control'];
        $this->control->cantidad_producto = isset($data['cantidad_producto']) ? $data['cantidad_producto'] : $existingControl['cantidad_producto'];
        $this->control->fk_afecciones = isset($data['fk_afecciones']) ? $data['fk_afecciones'] : $existingControl['fk_afecciones'];
        $this->control->fk_tipo_control = isset($data['fk_tipo_control']) ? $data['fk_tipo_control'] : $existingControl['fk_tipo_control'];
        $this->control->fk_productos_control = isset($data['fk_productos_control']) ? $data['fk_productos_control'] : $existingControl['fk_productos_control'];

        if ($this->control->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Control actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingControl = $this->control->getById($id);
        if (!$existingControl) {
            echo json_encode([
                'status' => 404,
                'message' => 'Control no encontrado'
            ]);
            return;
        }

        $this->control->id = $id;
        if ($this->control->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Control eliminado exitosamente'
            ]);
        }
    }
}