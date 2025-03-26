<?php
class Semillero {
    private $connect;
    private $table = "semilleros";
    
    public $id;
    public $fk_especie;
    public $unidad_medida;
    public $fecha_siembra;
    public $fecha_estimada;

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
        $query = "INSERT INTO $this->table (fk_especie, unidad_medida, fecha_siembra, fecha_estimada) VALUES (:fk_especie, :unidad_medida, :fecha_siembra, :fecha_estimada)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_especie', $this->fk_especie, PDO::PARAM_INT);
        $stmt->bindParam(':unidad_medida', $this->unidad_medida);
        $stmt->bindParam(':fecha_siembra', $this->fecha_siembra);
        $stmt->bindParam(':fecha_estimada', $this->fecha_estimada);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear semillero: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET fk_especie = :fk_especie, unidad_medida = :unidad_medida, fecha_siembra = :fecha_siembra, fecha_estimada = :fecha_estimada WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_especie', $this->fk_especie, PDO::PARAM_INT);
        $stmt->bindParam(':unidad_medida', $this->unidad_medida);
        $stmt->bindParam(':fecha_siembra', $this->fecha_siembra);
        $stmt->bindParam(':fecha_estimada', $this->fecha_estimada);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar semillero: " . $error[2]);
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
            die("Error al eliminar semillero: " . $error[2]);
        }
    }
}
?>