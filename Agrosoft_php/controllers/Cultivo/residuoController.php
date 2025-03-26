<?php
require_once './config/database.php';
require_once './models/Cultivo/residuoModel.php';

class ResiduoController {
    private $db;
    private $residuo;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->residuo = new Residuo($this->db);
    }

    public function getTodos(){
        $stmt = $this->residuo->getAll();
        $residuos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $residuos
        ]);
    }

    public function getPorId($id){
        $residuoData = $this->residuo->getById($id);
        if ($residuoData) {
            echo json_encode([
                'status' => 200,
                'data' => $residuoData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Residuo no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->residuo->fk_cultivo = isset($data['fk_cultivo']) ? $data['fk_cultivo'] : null;
        $this->residuo->fk_tipo = isset($data['fk_tipo']) ? $data['fk_tipo'] : null;
        $this->residuo->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->residuo->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;
        $this->residuo->fecha = isset($data['fecha']) ? $data['fecha'] : null;
        $this->residuo->tipo = isset($data['tipo']) ? $data['tipo'] : null;
        $this->residuo->cantidad = isset($data['cantidad']) ? $data['cantidad'] : null;

        if (!$this->residuo->fk_cultivo || !$this->residuo->fk_tipo || !$this->residuo->nombre) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos obligatorios'
            ]);
            return;
        }

        $newId = $this->residuo->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Residuo creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingResiduo = $this->residuo->getById($id);
        if (!$existingResiduo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Residuo no encontrado'
            ]);
            return;
        }

        $this->residuo->id = $id;
        $this->residuo->fk_cultivo = isset($data['fk_cultivo']) ? $data['fk_cultivo'] : $existingResiduo['fk_cultivo'];
        $this->residuo->fk_tipo = isset($data['fk_tipo']) ? $data['fk_tipo'] : $existingResiduo['fk_tipo'];
        $this->residuo->nombre = isset($data['nombre']) ? $data['nombre'] : $existingResiduo['nombre'];
        $this->residuo->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingResiduo['descripcion'];
        $this->residuo->fecha = isset($data['fecha']) ? $data['fecha'] : $existingResiduo['fecha'];
        $this->residuo->tipo = isset($data['tipo']) ? $data['tipo'] : $existingResiduo['tipo'];
        $this->residuo->cantidad = isset($data['cantidad']) ? $data['cantidad'] : $existingResiduo['cantidad'];

        if ($this->residuo->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Residuo actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingResiduo = $this->residuo->getById($id);
        if (!$existingResiduo) {
            echo json_encode([
                'status' => 404,
                'message' => 'Residuo no encontrado'
            ]);
            return;
        }

        $this->residuo->id = $id;
        if ($this->residuo->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Residuo eliminado exitosamente'
            ]);
        }
    }
}
