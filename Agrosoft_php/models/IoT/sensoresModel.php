<?php
class Sensores {
    private $connect;
    private $table = "Sensores";
    
    public $id_sensor;
    public $nombre;
    public $tipo_sensor;
    public $unidad_medida;
    public $medida_min;
    public $medida_max;

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
        $query = "SELECT * FROM $this->table WHERE id_sensor = :id LIMIT 1";
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
        $query = "INSERT INTO $this->table (nombre, tipo_sensor, unidad_medida, medida_min, medida_max) VALUES (:nombre, :tipo_sensor, :unidad_medida, :medida_min, :medida_max)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':tipo_sensor', $this->tipo_sensor);
        $stmt->bindParam(':unidad_medida', $this->unidad_medida);
        $stmt->bindParam(':medida_min', $this->medida_min, PDO::PARAM_STR);
        $stmt->bindParam(':medida_max', $this->medida_max, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear sensor: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET nombre = :nombre, tipo_sensor = :tipo_sensor, unidad_medida = :unidad_medida, medida_min = :medida_min, medida_max = :medida_max WHERE id_sensor = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':tipo_sensor', $this->tipo_sensor);
        $stmt->bindParam(':unidad_medida', $this->unidad_medida);
        $stmt->bindParam(':medida_min', $this->medida_min, PDO::PARAM_STR);
        $stmt->bindParam(':medida_max', $this->medida_max, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id_sensor, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar sensor: " . $error[2]);
        }
    }

    public function delete() {
        $query = "DELETE FROM $this->table WHERE id_sensor = :id";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':id', $this->id_sensor, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al eliminar sensor: " . $error[2]);
        }
    }
}
?>
