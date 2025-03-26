<?php
class Herramienta {
    private $connect;
    private $table = "Herramientas";
    
    public $id;
    public $fk_bodega;
    public $nombre;
    public $descripcion;
    public $unidades;

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
        $query = "INSERT INTO $this->table (fk_bodega, nombre, descripcion, unidades) VALUES (:fk_bodega, :nombre, :descripcion, :unidades)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_bodega', $this->fk_bodega, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':unidades', $this->unidades, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear herramienta: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET fk_bodega = :fk_bodega, nombre = :nombre, descripcion = :descripcion, unidades = :unidades WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_bodega', $this->fk_bodega, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':unidades', $this->unidades, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar herramienta: " . $error[2]);
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
            die("Error al eliminar herramienta: " . $error[2]);
        }
    }
}
?>