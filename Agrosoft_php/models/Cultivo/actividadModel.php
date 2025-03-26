<?php
class Actividades {
    private $connect;
    private $table = "Actividades";
    
    public $id;
    public $fk_cultivo;
    public $fk_usuario;
    public $fk_insumo;
    public $fk_programacion;
    public $fk_tipo_actividad;
    public $titulo;
    public $descripcion;
    public $fecha;
    public $cantidad_producto;

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
        $query = "INSERT INTO $this->table (fk_cultivo, fk_usuario, fk_insumo, fk_programacion, fk_tipo_actividad, titulo, descripcion, fecha, cantidad_producto) 
                  VALUES (:fk_cultivo, :fk_usuario, :fk_insumo, :fk_programacion, :fk_tipo_actividad, :titulo, :descripcion, :fecha, :cantidad_producto)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_cultivo', $this->fk_cultivo);
        $stmt->bindParam(':fk_usuario', $this->fk_usuario);
        $stmt->bindParam(':fk_insumo', $this->fk_insumo);
        $stmt->bindParam(':fk_programacion', $this->fk_programacion);
        $stmt->bindParam(':fk_tipo_actividad', $this->fk_tipo_actividad);
        $stmt->bindParam(':titulo', $this->titulo);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':fecha', $this->fecha);
        $stmt->bindParam(':cantidad_producto', $this->cantidad_producto);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear actividad: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET fk_cultivo = :fk_cultivo, fk_usuario = :fk_usuario, fk_insumo = :fk_insumo, fk_programacion = :fk_programacion, 
                  fk_tipo_actividad = :fk_tipo_actividad, titulo = :titulo, descripcion = :descripcion, fecha = :fecha, cantidad_producto = :cantidad_producto 
                  WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_cultivo', $this->fk_cultivo);
        $stmt->bindParam(':fk_usuario', $this->fk_usuario);
        $stmt->bindParam(':fk_insumo', $this->fk_insumo);
        $stmt->bindParam(':fk_programacion', $this->fk_programacion);
        $stmt->bindParam(':fk_tipo_actividad', $this->fk_tipo_actividad);
        $stmt->bindParam(':titulo', $this->titulo);
        $stmt->bindParam(':descripcion', $this->descripcion);
        $stmt->bindParam(':fecha', $this->fecha);
        $stmt->bindParam(':cantidad_producto', $this->cantidad_producto);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar actividad: " . $error[2]);
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
            die("Error al eliminar actividad: " . $error[2]);
        }
    }
}
?>