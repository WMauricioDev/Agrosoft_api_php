<?php
class ProductoControl {
    private $connect;
    private $table = "productos_control";
    
    public $id;
    public $nombre;
    public $precio;
    public $ficha_tecnica;
    public $contenido;
    public $tipo_contenido;
    public $unidades;

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
        $query = "INSERT INTO $this->table (nombre, precio, ficha_tecnica, contenido, tipo_contenido, unidades) 
                  VALUES (:nombre, :precio, :ficha_tecnica, :contenido, :tipo_contenido, :unidades)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':precio', $this->precio);
        $stmt->bindParam(':ficha_tecnica', $this->ficha_tecnica);
        $stmt->bindParam(':contenido', $this->contenido);
        $stmt->bindParam(':tipo_contenido', $this->tipo_contenido);
        $stmt->bindParam(':unidades', $this->unidades);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear producto de control: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET 
                  nombre = :nombre, precio = :precio, ficha_tecnica = :ficha_tecnica, 
                  contenido = :contenido, tipo_contenido = :tipo_contenido, unidades = :unidades 
                  WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':precio', $this->precio);
        $stmt->bindParam(':ficha_tecnica', $this->ficha_tecnica);
        $stmt->bindParam(':contenido', $this->contenido);
        $stmt->bindParam(':tipo_contenido', $this->tipo_contenido);
        $stmt->bindParam(':unidades', $this->unidades);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar producto de control: " . $error[2]);
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
            die("Error al eliminar producto de control: " . $error[2]);
        }
    }
}
?>
