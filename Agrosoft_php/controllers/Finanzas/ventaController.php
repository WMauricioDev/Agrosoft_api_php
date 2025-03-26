<?php
require_once   './config/database.php';
require_once './models/Finanzas/ventaModel.php';

class VentaController {
    private $db;
    private $venta;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->venta = new Venta($this->db);
    }

    public function getTodos(){
        $stmt = $this->venta->getAll();
        $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $ventas
        ]);
    }

    public function getPorId($id){
        $ventaData = $this->venta->getById($id);
        if ($ventaData) {
            echo json_encode([
                'status' => 200,
                'data' => $ventaData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Venta no encontrada'
            ]);
        }
    }

    public function crear($data){
        $this->venta->fk_cosecha = isset($data['fk_cosecha']) ? $data['fk_cosecha'] : null;
        $this->venta->precio_unitario = isset($data['precio_unitario']) ? $data['precio_unitario'] : null;
        $this->venta->producto_vendido =  isset($data['producto_vendido']) ? $data['producto_vendido'] : null;
        $this->venta->cantidad =  isset($data['cantidad']) ? $data['cantidad'] : null;
        $this->venta->fecha_venta =  isset($data['fecha_venta']) ? $data['fecha_venta'] : null;
        if (!$this->venta->fk_cosecha || !$this->venta->precio_unitario || !$this->venta->producto_vendido || !$this->venta->cantidad || !$this->venta->fecha_venta) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos requeridos'
            ]);
            return;
        }

        $newId = $this->venta->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Venta registrada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingVenta = $this->venta->getById($id);
        if (!$existingVenta) {
            echo json_encode([
                'status' => 404,
                'message' => 'Venta no encontrada'
            ]);
            return;
        }

        $this->venta->id = $id;
        $this->venta->fk_cosecha = isset($data['fk_cosecha']) ? $data['fk_cosecha'] : $existingVenta['fk_cosecha'];
        $this->venta->precio_unitario = isset($data['precio_unitario']) ? $data['precio_unitario'] :$existingVenta['precio_unitario'];
        $this->venta->producto_vendido =  isset($data['producto_vendido']) ? $data['producto_vendido'] : $existingVenta['producto_vendido'];
        $this->venta->cantidad =  isset($data['cantidad']) ? $data['cantidad'] : $existingVenta['cantidad'];
        $this->venta->fecha_venta =  isset($data['fecha_venta']) ? $data['fecha_venta'] : $existingVenta['fecha_venta'];
        if ($this->venta->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Venta actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingVenta = $this->venta->getById($id);
        if (!$existingVenta) {
            echo json_encode([
                'status' => 404,
                'message' => 'Venta no encontrada'
            ]);
            return;
        }

        $this->venta->id = $id;
        if ($this->venta->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Venta eliminada exitosamente'
            ]);
        }
    }
}
?>
