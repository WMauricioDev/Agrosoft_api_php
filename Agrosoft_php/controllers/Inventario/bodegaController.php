<?php

require_once   './config/database.php';
require_once './models/Inventario/InventarioModel.php';

class BodegaController {
    private $db;
    private $bodega;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->bodega = new Bodega($this->db);
    }

    public function getTodos() {
        $stmt = $this->bodega->getAll();
        $bodegas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $bodegas
        ]);
    }

    public function getPorId($id) {
        $bodegaData = $this->bodega->getById($id);
        if ($bodegaData) {
            echo json_encode([
                'status' => 200,
                'data' => $bodegaData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Bodega no encontrada'
            ]);
        }
    }

    public function crear($data) {
        $this->bodega->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->bodega->ubicacion = isset($data['ubicacion']) ? $data['ubicacion'] : null;
        $this->bodega->tipo_bodega = isset($data['tipo_bodega']) ? $data['tipo_bodega'] : null;

        if (!$this->bodega->nombre || !$this->bodega->tipo_bodega) {
            echo json_encode([
                'status' => 400,
                'message' => 'Falta el nombre o tipo de bodega'
            ]);
            return;
        }

        $newId = $this->bodega->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Bodega creada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data) {
        $existingBodega = $this->bodega->getById($id);
        if (!$existingBodega) {
            echo json_encode([
                'status' => 404,
                'message' => 'Bodega no encontrada'
            ]);
            return;
        }

        $this->bodega->id_bodega = $id;
        $this->bodega->nombre = isset($data['nombre']) ? $data['nombre'] : $existingBodega['nombre'];
        $this->bodega->ubicacion = isset($data['ubicacion']) ? $data['ubicacion'] : $existingBodega['ubicacion'];
        $this->bodega->tipo_bodega = isset($data['tipo_bodega']) ? $data['tipo_bodega'] : $existingBodega['tipo_bodega'];

        if ($this->bodega->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Bodega actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id) {
        $existingBodega = $this->bodega->getById($id);
        if (!$existingBodega) {
            echo json_encode([
                'status' => 404,
                'message' => 'Bodega no encontrada'
            ]);
            return;
        }

        $this->bodega->id_bodega = $id;
        if ($this->bodega->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Bodega eliminada exitosamente'
            ]);
        }
    }
}
