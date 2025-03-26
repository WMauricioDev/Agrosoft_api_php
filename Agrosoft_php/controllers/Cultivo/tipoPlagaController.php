<?php
require_once './config/database.php';
require_once './models/Cultivo/tipoPlagaModel.php';

class TipoPlagaController {
    private $db;
    private $tipoPlaga;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tipoPlaga = new TipoPlaga($this->db);
    }

    public function getTodos(){
        $stmt = $this->tipoPlaga->getAll();
        $tipos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $tipos
        ]);
    }

    public function getPorId($id){
        $tipoData = $this->tipoPlaga->getById($id);
        if ($tipoData) {
            echo json_encode([
                'status' => 200,
                'data' => $tipoData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de plaga no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->tipoPlaga->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->tipoPlaga->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;
        $this->tipoPlaga->img = isset($data['img']) ? $data['img'] : null;

        if (!$this->tipoPlaga->nombre) {
            echo json_encode([
                'status' => 400,
                'message' => 'Falta el nombre del tipo de plaga'
            ]);
            return;
        }

        $newId = $this->tipoPlaga->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Tipo de plaga creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingTipo = $this->tipoPlaga->getById($id);
        if (!$existingTipo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de plaga no encontrado'
            ]);
            return;
        }

        $this->tipoPlaga->id = $id;
        $this->tipoPlaga->nombre = isset($data['nombre']) ? $data['nombre'] : $existingTipo['nombre'];
        $this->tipoPlaga->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingTipo['descripcion'];
        $this->tipoPlaga->img = isset($data['img']) ? $data['img'] : $existingTipo['img'];

        if ($this->tipoPlaga->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de plaga actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingTipo = $this->tipoPlaga->getById($id);
        if (!$existingTipo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Tipo de plaga no encontrado'
            ]);
            return;
        }

        $this->tipoPlaga->id = $id;
        if ($this->tipoPlaga->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Tipo de plaga eliminado exitosamente'
            ]);
        }
    }
}
?>
