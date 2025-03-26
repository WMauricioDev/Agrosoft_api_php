<?php
class Cultivo {
    private $connect;
    private $table = "cultivos";

    public $id;
    public $nombre;
    public $unidad_de_medida;
    public $estado;
    public $fecha_siembra;
    public $fk_especie;

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
        $query = "INSERT INTO $this->table (nombre, unidad_de_medida, estado, fecha_siembra, fk_especie) 
                  VALUES (:nombre, :unidad_de_medida, :estado, :fecha_siembra, :fk_especie)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':unidad_de_medida', $this->unidad_de_medida, PDO::PARAM_INT);
        $stmt->bindParam(':estado', $this->estado);
        $stmt->bindParam(':fecha_siembra', $this->fecha_siembra);
        $stmt->bindParam(':fk_especie', $this->fk_especie, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear cultivo: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table 
                  SET nombre = :nombre, unidad_de_medida = :unidad_de_medida, estado = :estado, 
                      fecha_siembra = :fecha_siembra, fk_especie = :fk_especie 
                  WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':unidad_de_medida', $this->unidad_de_medida, PDO::PARAM_INT);
        $stmt->bindParam(':estado', $this->estado);
        $stmt->bindParam(':fecha_siembra', $this->fecha_siembra);
        $stmt->bindParam(':fk_especie', $this->fk_especie, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar cultivo: " . $error[2]);
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
            die("Error al eliminar cultivo: " . $error[2]);
        }
    }
}
?>
