<?php
require_once   './config/database.php';
require_once './models/Cultivo/productosControlModel.php';

class ProductoControlController {
    private $db;
    private $productoControl;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->productoControl = new ProductoControl($this->db);
    }

    public function getTodos(){
        $stmt = $this->productoControl->getAll();
        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $productos
        ]);
    }

    public function getPorId($id){
        $productoData = $this->productoControl->getById($id);
        if ($productoData) {
            echo json_encode([
                'status' => 200,
                'data' => $productoData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Producto de control no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->productoControl->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->productoControl->precio = isset($data['precio']) ? $data['precio'] : null;
        $this->productoControl->ficha_tecnica = isset($data['ficha_tecnica']) ? $data['ficha_tecnica'] : null;
        $this->productoControl->contenido = isset($data['contenido']) ? $data['contenido'] : null;
        $this->productoControl->tipo_contenido = isset($data['tipo_contenido']) ? $data['tipo_contenido'] : null;
        $this->productoControl->unidades = isset($data['unidades']) ? $data['unidades'] : null;

        if (!$this->productoControl->nombre || !$this->productoControl->precio || !$this->productoControl->contenido || !$this->productoControl->tipo_contenido || !$this->productoControl->unidades) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos obligatorios (nombre, precio, contenido, tipo_contenido, unidades)'
            ]);
            return;
        }

        $newId = $this->productoControl->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Producto de control creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingProducto = $this->productoControl->getById($id);
        if (!$existingProducto) {
            echo json_encode([
                'status' => 404,
                'message' => 'Producto de control no encontrado'
            ]);
            return;
        }

        $this->productoControl->id = $id;
        $this->productoControl->nombre = isset($data['nombre']) ? $data['nombre'] : $existingProducto['nombre'];
        $this->productoControl->precio = isset($data['precio']) ? $data['precio'] : $existingProducto['precio'];
        $this->productoControl->ficha_tecnica = isset($data['ficha_tecnica']) ? $data['ficha_tecnica'] : $existingProducto['ficha_tecnica'];
        $this->productoControl->contenido = isset($data['contenido']) ? $data['contenido'] : $existingProducto['contenido'];
        $this->productoControl->tipo_contenido = isset($data['tipo_contenido']) ? $data['tipo_contenido'] : $existingProducto['tipo_contenido'];
        $this->productoControl->unidades = isset($data['unidades']) ? $data['unidades'] : $existingProducto['unidades'];

        if ($this->productoControl->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Producto de control actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingProducto = $this->productoControl->getById($id);
        if (!$existingProducto) {
            echo json_encode([
                'status' => 404,
                'message' => 'Producto de control no encontrado'
            ]);
            return;
        }

        $this->productoControl->id = $id;
        if ($this->productoControl->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Producto de control eliminado exitosamente'
            ]);
        }
    }
}
?>
