<?php
require_once './config/database.php';
require_once './models/Cultivo/tipoActividadModel.php';

class TipoActividadController {
    private $db;
    private $tipoActividad;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tipoActividad = new TipoActividad($this->db);
    }

    public function getTodos(){
        $tipoActividad = verificarToken();

        $stmt = $this->tipoActividad->getAll();
        $tipos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $tipos
        ]);
    }

    public function getPorId($id){
        $tipoActividad = verificarToken();

        $tipoData = $this->tipoActividad->getById($id);
        if ($tipoData) {
            echo json_encode([
                'status' => 200,
                'data' => $tipoData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de actividad no encontrado'
            ]);
        }
    }

    public function crear($data){
        $tipoActividad = verificarToken();

        $this->tipoActividad->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->tipoActividad->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;

        if (!$this->tipoActividad->nombre) {
            echo json_encode([
                'status' => 400,
                'message' => 'Falta el nombre del tipo de actividad'
            ]);
            return;
        }

        $newId = $this->tipoActividad->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Tipo de actividad creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $tipoActividad = verificarToken();

        $existingTipo = $this->tipoActividad->getById($id);
        if (!$existingTipo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de actividad no encontrado'
            ]);
            return;
        }

        $this->tipoActividad->id = $id;
        $this->tipoActividad->nombre = isset($data['nombre']) ? $data['nombre'] : $existingTipo['nombre'];
        $this->tipoActividad->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingTipo['descripcion'];

        if ($this->tipoActividad->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de actividad actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $tipoActividad = verificarToken();

        $existingTipo = $this->tipoActividad->getById($id);
        if (!$existingTipo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de actividad no encontrado'
            ]);
            return;
        }

        $this->tipoActividad->id = $id;
        if ($this->tipoActividad->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de actividad eliminado exitosamente'
            ]);
        }
    }
}
?>
