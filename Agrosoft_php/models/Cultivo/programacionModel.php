<?php
class Programacion {
    private $connect;
    private $table = "Programacion";
    
    public $id_programacion;
    public $ubicacion;
    public $estado;
    public $fecha_prog;

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
        $query = "SELECT * FROM $this->table WHERE id_programacion = :id LIMIT 1";
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
        $query = "INSERT INTO $this->table (ubicacion, estado, fecha_prog) 
                  VALUES (:ubicacion, :estado, :fecha_prog)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':ubicacion', $this->ubicacion);
        $stmt->bindParam(':estado', $this->estado);
        $stmt->bindParam(':fecha_prog', $this->fecha_prog);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear programación: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table 
                  SET ubicacion = :ubicacion,estado = :estado, fecha_prog = :fecha_prog 
                  WHERE id_programacion = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':ubicacion', $this->ubicacion);
        $stmt->bindParam(':estado', $this->estado);
        $stmt->bindParam(':fecha_prog', $this->fecha_prog);
        $stmt->bindParam(':id', $this->id_programacion, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar programación: " . $error[2]);
        }
    }

    public function delete() {
        $query = "DELETE FROM $this->table WHERE id_programacion = :id";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':id', $this->id_programacion, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al eliminar programación: " . $error[2]);
        }
    }
}
?>
