<?php
class Venta {
    private $connect;
    private $table = "venta";
    
    public $id;
    public $fk_cosecha;
    public $precio_unitario;
    public $producto_vendido;
    public $cantidad;
    public $fecha_venta;

    public function __construct($connect) {
        $this->connect = $connect; 
    }

    public function getAll() {
        $query = "SELECT * FROM $this->table";
        $stmt = $this->connect->prepare($query); 
        if ($stmt->execute()) {
            return $stmt;
        } else {
            $error = $stmt->errorInfo(); 
            die("Error en la consulta: " . $error[2]); 
        }
    }

    public function getById($id) {
        $query = "SELECT * FROM $this->table WHERE id = :id LIMIT 1";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $error = $stmt->errorInfo();
            die("Error en la consulta: " . $error[2]);
        }
    }

    public function create() {
        $query = "INSERT INTO $this->table (fk_cosecha, precio_unitario, producto_vendido, cantidad, fecha_venta) 
                  VALUES (:fk_cosecha, :precio_unitario, :producto_vendido, :cantidad, :fecha_venta)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_cosecha', $this->fk_cosecha, PDO::PARAM_INT);
        $stmt->bindParam(':precio_unitario', $this->precio_unitario);
        $stmt->bindParam(':producto_vendido', $this->producto_vendido, PDO::PARAM_STR);
        $stmt->bindParam(':cantidad', $this->cantidad, PDO::PARAM_INT);
        $stmt->bindParam(':fecha_venta', $this->fecha_venta);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al registrar la venta: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET fk_cosecha = :fk_cosecha, precio_unitario = :precio_unitario, 
                  producto_vendido = :producto_vendido, cantidad = :cantidad, fecha_venta = :fecha_venta WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_cosecha', $this->fk_cosecha, PDO::PARAM_INT);
        $stmt->bindParam(':precio_unitario', $this->precio_unitario);
        $stmt->bindParam(':producto_vendido', $this->producto_vendido, PDO::PARAM_STR);
        $stmt->bindParam(':cantidad', $this->cantidad, PDO::PARAM_INT);
        $stmt->bindParam(':fecha_venta', $this->fecha_venta);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar la venta: " . $error[2]);
        }
    }

    public function delete() {
        $query = "DELETE FROM $this->table WHERE id = :id";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al eliminar la venta: " . $error[2]);
        }
    }
}
?>
