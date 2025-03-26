<?php
require_once   './config/database.php';
require_once './models/Inventario/herramientaModel.php';;

class HerramientaController {
    private $db;
    private $herramienta;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->herramienta = new Herramienta($this->db);
    }

    public function getTodos(){
        $stmt = $this->herramienta->getAll();
        $herramientas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $herramientas
        ]);
    }

    public function getPorId($id){
        $herramientaData = $this->herramienta->getById($id);
        if ($herramientaData) {
            echo json_encode([
                'status' => 200,
                'data' => $herramientaData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Herramienta no encontrada'
            ]);
        }
    }

    public function crear($data){
        $this->herramienta->fk_bodega = isset($data['fk_bodega']) ? $data['fk_bodega'] : null;
        $this->herramienta->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->herramienta->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;
        $this->herramienta->unidades = isset($data['unidades']) ? $data['unidades'] : null;

        if (!$this->herramienta->fk_bodega || !$this->herramienta->nombre || !$this->herramienta->unidades) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos requeridos'
            ]);
            return;
        }

        $newId = $this->herramienta->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Herramienta creada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingHerramienta = $this->herramienta->getById($id);
        if (!$existingHerramienta) {
            echo json_encode([
                'status' => 404,
                'message' => 'Herramienta no encontrada'
            ]);
            return;
        }

        $this->herramienta->id = $id;
        $this->herramienta->fk_bodega = isset($data['fk_bodega']) ? $data['fk_bodega'] : $existingHerramienta['fk_bodega'];
        $this->herramienta->nombre = isset($data['nombre']) ? $data['nombre'] : $existingHerramienta['nombre'];
        $this->herramienta->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existingHerramienta['descripcion'];
        $this->herramienta->unidades = isset($data['unidades']) ? $data['unidades'] : $existingHerramienta['unidades'];

        if ($this->herramienta->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Herramienta actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingHerramienta = $this->herramienta->getById($id);
        if (!$existingHerramienta) {
            echo json_encode([
                'status' => 404,
                'message' => 'Herramienta no encontrada'
            ]);
            return;
        }

        $this->herramienta->id = $id;
        if ($this->herramienta->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Herramienta eliminada exitosamente'
            ]);
        }
    }
}
?>