<?php
class Control {
    private $connect;
    private $table = "controles";
    
    public $id;
    public $descripcion;
    public $fecha_control;
    public $cantidad_producto;
    public $fk_afecciones;
    public $fk_tipo_control;
    public $fk_productos_control;

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
        $query = "INSERT INTO $this->table (descripcion, fecha_control, cantidad_producto, fk_afecciones, fk_tipo_control, fk_productos_control) 
                  VALUES (:descripcion, :fecha_control, :cantidad_producto, :fk_afecciones, :fk_tipo_control, :fk_productos_control)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':fecha_control', $this->fecha_control);
        $stmt->bindParam(':cantidad_producto', $this->cantidad_producto, PDO::PARAM_INT);
        $stmt->bindParam(':fk_afecciones', $this->fk_afecciones, PDO::PARAM_INT);
        $stmt->bindParam(':fk_tipo_control', $this->fk_tipo_control, PDO::PARAM_INT);
        $stmt->bindParam(':fk_productos_control', $this->fk_productos_control, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al registrar control: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table 
                  SET descripcion = :descripcion, fecha_control = :fecha_control, cantidad_producto = :cantidad_producto, 
                      fk_afecciones = :fk_afecciones, fk_tipo_control = :fk_tipo_control, fk_productos_control = :fk_productos_control
                  WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':fecha_control', $this->fecha_control);
        $stmt->bindParam(':cantidad_producto', $this->cantidad_producto, PDO::PARAM_INT);
        $stmt->bindParam(':fk_afecciones', $this->fk_afecciones, PDO::PARAM_INT);
        $stmt->bindParam(':fk_tipo_control', $this->fk_tipo_control, PDO::PARAM_INT);
        $stmt->bindParam(':fk_productos_control', $this->fk_productos_control, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar control: " . $error[2]);
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
            die("Error al eliminar control: " . $error[2]);
        }
    }
}
?>
