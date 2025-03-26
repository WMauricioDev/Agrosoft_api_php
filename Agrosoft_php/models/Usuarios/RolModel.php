<?php
class Rol {
    private $connect;
    private $table = "roles";
    
    public $id;
    public $nombre_rol;
    public $fecha_creacion;
    public $ultima_actualizacion;

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
        $query = "INSERT INTO $this->table (nombre_rol, fecha_creacion, ultima_actualizacion) VALUES (:nombre_rol, NOW(), NOW())";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre_rol', $this->nombre_rol);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear rol: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET nombre_rol = :nombre_rol, ultima_actualizacion = NOW() WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre_rol', $this->nombre_rol);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar rol: " . $error[2]);
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
            die("Error al eliminar rol: " . $error[2]);
        }
    }
}
?>
