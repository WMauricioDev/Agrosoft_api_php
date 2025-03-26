<?php
class Bodega {
    private $connect;
    private $table = "Bodega";
    
    public $id_bodega;
    public $nombre;
    public $ubicacion;
    public $tipo_bodega;

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
        $query = "SELECT * FROM $this->table WHERE id_bodega = :id LIMIT 1";
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
        $query = "INSERT INTO $this->table (nombre, ubicacion, tipo_bodega) VALUES (:nombre, :ubicacion, :tipo_bodega)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':ubicacion', $this->ubicacion);
        $stmt->bindParam(':tipo_bodega', $this->tipo_bodega);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear bodega: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET nombre = :nombre, ubicacion = :ubicacion, tipo_bodega = :tipo_bodega WHERE id_bodega = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':ubicacion', $this->ubicacion);
        $stmt->bindParam(':tipo_bodega', $this->tipo_bodega);
        $stmt->bindParam(':id', $this->id_bodega, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar bodega: " . $error[2]);
        }
    }

    public function delete() {
        $query = "DELETE FROM $this->table WHERE id_bodega = :id";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':id', $this->id_bodega, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al eliminar bodega: " . $error[2]);
        }
    }
}
