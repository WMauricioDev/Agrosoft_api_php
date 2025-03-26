<?php
class SensoresBancal {
    private $connect;
    private $table = "Sensores_Bancal";

    public $id;
    public $fk_sensor;
    public $fk_bancal;

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
        $query = "INSERT INTO $this->table (fk_sensor, fk_bancal) VALUES (:fk_sensor, :fk_bancal)";
        $stmt = $this->connect->prepare($query);
        
        $stmt->bindParam(':fk_sensor', $this->fk_sensor, PDO::PARAM_INT);
        $stmt->bindParam(':fk_bancal', $this->fk_bancal, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear sensor_bancal: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET fk_sensor = :fk_sensor, fk_bancal = :fk_bancal WHERE id = :id";
        $stmt = $this->connect->prepare($query);
        
        $stmt->bindParam(':fk_sensor', $this->fk_sensor, PDO::PARAM_INT);
        $stmt->bindParam(':fk_bancal', $this->fk_bancal, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar sensor_bancal: " . $error[2]);
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
            die("Error al eliminar sensor_bancal: " . $error[2]);
        }
    }
}
?>
