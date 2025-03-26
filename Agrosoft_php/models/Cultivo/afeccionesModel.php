<?php
class Afeccion {
    private $connect;
    private $table = "afecciones";
    
    public $id;
    public $prioridad;
    public $fecha_encuentro;
    public $fk_plantacion;
    public $fk_plaga;

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
        $query = "INSERT INTO $this->table (prioridad, fecha_encuentro, fk_plantacion, fk_plaga) 
                  VALUES (:prioridad, :fecha_encuentro, :fk_plantacion, :fk_plaga)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':prioridad', $this->prioridad);
        $stmt->bindParam(':fecha_encuentro', $this->fecha_encuentro);
        $stmt->bindParam(':fk_plantacion', $this->fk_plantacion, PDO::PARAM_INT);
        $stmt->bindParam(':fk_plaga', $this->fk_plaga, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al registrar afección: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table 
                  SET prioridad = :prioridad, fecha_encuentro = :fecha_encuentro, 
                      fk_plantacion = :fk_plantacion, fk_plaga = :fk_plaga
                  WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':prioridad', $this->prioridad);
        $stmt->bindParam(':fecha_encuentro', $this->fecha_encuentro);
        $stmt->bindParam(':fk_plantacion', $this->fk_plantacion, PDO::PARAM_INT);
        $stmt->bindParam(':fk_plaga', $this->fk_plaga, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar afección: " . $error[2]);
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
            die("Error al eliminar afección: " . $error[2]);
        }
    }
}
?>
