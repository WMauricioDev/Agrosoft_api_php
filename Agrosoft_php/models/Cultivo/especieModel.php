<?php
class Especie {
    private $connect;
    private $table = "especies";

    public $id;
    public $nombre;
    public $descripcion;
    public $img;
    public $tiempo_crecimiento;
    public $fk_tipo_especie;

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
        $query = "INSERT INTO $this->table (nombre, descripcion, tiempo_crecimiento, fk_tipo_especie) 
                  VALUES (:nombre, :descripcion, :tiempo_crecimiento, :fk_tipo_especie)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':tiempo_crecimiento', $this->tiempo_crecimiento);
        $stmt->bindParam(':fk_tipo_especie', $this->fk_tipo_especie, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear especie: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table 
                  SET nombre = :nombre, descripcion = :descripcion, 
                      tiempo_crecimiento = :tiempo_crecimiento, fk_tipo_especie = :fk_tipo_especie 
                  WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':tiempo_crecimiento', $this->tiempo_crecimiento);
        $stmt->bindParam(':fk_tipo_especie', $this->fk_tipo_especie, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar especie: " . $error[2]);
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
            die("Error al eliminar especie: " . $error[2]);
        }
    }
}
?>
