<?php
class SalarioMinimo {
    private $connect;
    private $table = "salario_minimo";
    
    public $id;
    public $valor;
    public $fecha_aplicacion;

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
        $query = "INSERT INTO $this->table (valor, fecha_aplicacion) VALUES (:valor, :fecha_aplicacion)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':valor', $this->valor, PDO::PARAM_STR);
        $stmt->bindParam(':fecha_aplicacion', $this->fecha_aplicacion);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear salario mínimo: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET valor = :valor, fecha_aplicacion = :fecha_aplicacion WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':valor', $this->valor, PDO::PARAM_STR);
        $stmt->bindParam(':fecha_aplicacion', $this->fecha_aplicacion);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar salario mínimo: " . $error[2]);
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
            die("Error al eliminar salario mínimo: " . $error[2]);
        }
    }
}
?>
