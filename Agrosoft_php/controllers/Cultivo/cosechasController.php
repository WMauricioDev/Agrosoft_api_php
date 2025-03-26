<?php

require_once   './config/database.php';
require_once './models/Cultivo/cosechasModel.php';
require_once __DIR__ . '/../middleware/middleware.php';

class CosechasController{
    private $db;
    private $cosecha;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->cosecha = new Cosecha($this->db);
    }

    public function getTodos(){
        $stmt = $this->cosecha->getAll();
        $cosechas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $cosechas
        ]);
    }

    public function getPorId($id){
        $cosechaData = $this->cosecha->getById($id);
        if ($cosechaData) {
            echo json_encode([
                'status' => 200,
                'data' => $cosechaData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'data' => 'No se encontro la cosecha'
            ]);
        }
    }


    public function crear($data){
        
        $this->cosecha->fk_cultivo = isset($data['fk_cultivo']) ? $data['fk_cultivo'] : null;
        $this->cosecha->fecha = isset($data['fecha']) ? $data['fecha'] : null;
        $this->cosecha->cantidad = isset($data['cantidad']) ? $data['cantidad'] : null;

        if (!$this->cosecha->fk_cultivo) {
            echo json_encode([
                'status' => 404,
                'Message' => 'Faltan campos por completar'
            ]);
        }
        $newId = $this->cosecha->create();
        echo json_encode([
            'status' => 200,
            'Message'=> 'Cosecha registrada con exito',
            'id' => $newId
        ]);

    }

    public function actualizar($id, $data) {  
        $existeCosecha = $this->cosecha->getById($id);
        if (!$existeCosecha) {
            http_response_code(404);
            echo json_encode([
                'status' => 404,
                'Message' => "No se encontró la cosecha"
            ]);
            return;
        }
    
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                'status' => 400,
                'Message' => "Los datos deben ser un array"
            ]);
            return;
        }
    
        $camposPermitidos = ['fk_cultivo', 'fecha', 'cantidad'];
        $camposRecibidos = array_intersect_key($data, array_flip($camposPermitidos));
        
        if (empty($camposRecibidos)) {
            http_response_code(400);
            echo json_encode([
                'status' => 400,
                'Message' => "Debe proporcionar al menos un campo para actualizar"
            ]);
            return;
        }
            $this->cosecha->id = $id;
        $this->cosecha->fk_cultivo = $data['fk_cultivo'] ?? $existeCosecha['fk_cultivo'];
        $this->cosecha->fecha = $data['fecha'] ?? $existeCosecha['fecha'];
        $this->cosecha->cantidad = $data['cantidad'] ?? $existeCosecha['cantidad'];
    
        if ($this->cosecha->update()) {
            http_response_code(200);
            echo json_encode([
                'status' => 200,
                'Message' => 'Se actualizó la cosecha correctamente',
                'updated_fields' => array_keys($camposRecibidos)
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => 500,
                'Message' => 'Error al actualizar la cosecha'
            ]);
        }
    }

    public function eliminar($id){
        $existeCosecha = $this->cosecha->getById($id);
        if (!$existeCosecha) {
            echo json_encode([
                'status' => 404,
                'Message' => "No se encontro la cosecha"
            ]);
        }
        $this->cosecha->id = $id;

        if ($this->cosecha->delete()) {
            echo json_encode([
                'status' => 200,
                'Message' => "Se elimino la cosecha correctamente"
            ]);
        }
    }
}