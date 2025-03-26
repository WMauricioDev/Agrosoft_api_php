<?php
require_once './config/database.php';
require_once './models/Cultivo/tipoControlModel.php';

class TipoControlController {
    private $db;
    private $tipoControl;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tipoControl = new TipoControl($this->db);
    }

    public function getTodos(){
        $tipocontrol = verificarToken();

        $stmt = $this->tipoControl->getAll();
        $tipos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $tipos
        ]);
    }

    public function getPorId($id){
        $tipocontrol = verificarToken();

        $tipoData = $this->tipoControl->getById($id);
        if ($tipoData) {
            echo json_encode([
                'status' => 200,
                'data' => $tipoData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de control no encontrado'
            ]);
        }
    }

    public function crear($data){
        $tipocontrol = verificarToken();

        $this->tipoControl->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->tipoControl->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;

        if (!$this->tipoControl->nombre) {
            echo json_encode([
                'status' => 400,
                'message' => 'Falta el nombre del tipo de control'
            ]);
            return;
        }

        $newId = $this->tipoControl->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Tipo de control creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $tipocontrol = verificarToken();

        $existingTipo = $this->tipoControl->getById($id);
        if (!$existingTipo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de control no encontrado'
            ]);
            return;
        }

        $this->tipoControl->id = $id;
        $this->tipoControl->nombre = isset($data['nombre']) ? $data['nombre'] : $existingTipo['nombre'];
        $this->tipoControl->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingTipo['descripcion'];

        if ($this->tipoControl->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de control actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $tipocontrol = verificarToken();

        $existingTipo = $this->tipoControl->getById($id);
        if (!$existingTipo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de control no encontrado'
            ]);
            return;
        }

        $this->tipoControl->id = $id;
        if ($this->tipoControl->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de control eliminado exitosamente'
            ]);
        }
    }
}
?>