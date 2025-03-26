<?php
require_once   './config/database.php';
require_once './models/Cultivo/tipoResiduoModel.php';

class TipoResiduoController {
    private $db;
    private $tipoResiduo;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tipoResiduo = new TipoResiduo($this->db);
    }

    public function getTodos(){
        $stmt = $this->tipoResiduo->getAll();
        $tipos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $tipos
        ]);
    }

    public function getPorId($id){
        $tipoData = $this->tipoResiduo->getById($id);
        if ($tipoData) {
            echo json_encode([
                'status' => 200,
                'data' => $tipoData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de residuo no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->tipoResiduo->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->tipoResiduo->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;

        if (!$this->tipoResiduo->nombre) {
            echo json_encode([
                'status' => 400,
                'message' => 'Falta el nombre del tipo de residuo'
            ]);
            return;
        }

        $newId = $this->tipoResiduo->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Tipo de residuo creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingTipo = $this->tipoResiduo->getById($id);
        if (!$existingTipo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de residuo no encontrado'
            ]);
            return;
        }

        $this->tipoResiduo->id = $id;
        $this->tipoResiduo->nombre = isset($data['nombre']) ? $data['nombre'] : $existingTipo['nombre'];
        $this->tipoResiduo->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingTipo['descripcion'];

        if ($this->tipoResiduo->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de residuo actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingTipo = $this->tipoResiduo->getById($id);
        if (!$existingTipo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de residuo no encontrado'
            ]);
            return;
        }

        $this->tipoResiduo->id = $id;
        if ($this->tipoResiduo->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de residuo eliminado exitosamente'
            ]);
        }
    }
}
?>
