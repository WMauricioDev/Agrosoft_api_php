<?php
class Residuo {
    private $connect;
    private $table = "Residuos";
    
    public $id;
    public $fk_cultivo;
    public $fk_tipo;
    public $nombre;
    public $descripcion;
    public $fecha;
    public $tipo;
    public $cantidad;

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
        $query = "INSERT INTO $this->table (fk_cultivo, fk_tipo, nombre, descripcion, fecha, tipo, cantidad) 
                  VALUES (:fk_cultivo, :fk_tipo, :nombre, :descripcion, :fecha, :tipo, :cantidad)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_cultivo', $this->fk_cultivo, PDO::PARAM_INT);
        $stmt->bindParam(':fk_tipo', $this->fk_tipo, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':fecha', $this->fecha);
        $stmt->bindParam(':tipo', $this->tipo);
        $stmt->bindParam(':cantidad', $this->cantidad, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear residuo: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET fk_cultivo = :fk_cultivo, fk_tipo = :fk_tipo, nombre = :nombre, 
                  descripcion = :descripcion, fecha = :fecha, tipo = :tipo, cantidad = :cantidad WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_cultivo', $this->fk_cultivo, PDO::PARAM_INT);
        $stmt->bindParam(':fk_tipo', $this->fk_tipo, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':fecha', $this->fecha);
        $stmt->bindParam(':tipo', $this->tipo);
        $stmt->bindParam(':cantidad', $this->cantidad, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar residuo: " . $error[2]);
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
            die("Error al eliminar residuo: " . $error[2]);
        }
    }
}
?>