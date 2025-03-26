<?php
class Usuario {
    private $connect;
    private $table = "usuarios";
    
    public $id;
    public $identificacion;
    public $nombre;
    public $apellido;
    public $fecha_nacimiento;
    public $telefono;
    public $email;
    public $password;
    public $area_desarrollo;
    public $fk_rol;

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
        $query = "INSERT INTO $this->table 
                  (identificacion, nombre, apellido, fecha_nacimiento, telefono, email, password, area_desarrollo, fk_rol) 
                  VALUES (:identificacion, :nombre, :apellido, :fecha_nacimiento, :telefono, :email, :password, :area_desarrollo, :fk_rol)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':identificacion', $this->identificacion, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':apellido', $this->apellido);
        $stmt->bindParam(':fecha_nacimiento', $this->fecha_nacimiento);
        $stmt->bindParam(':telefono', $this->telefono);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':area_desarrollo', $this->area_desarrollo);
        $stmt->bindParam(':fk_rol', $this->fk_rol, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            $error = $stmt->errorInfo();
            die("Error al registrar usuario: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table 
                  SET identificacion = :identificacion, nombre = :nombre, apellido = :apellido, 
                      fecha_nacimiento = :fecha_nacimiento, telefono = :telefono, email = :email, 
                      password = :password, area_desarrollo = :area_desarrollo, fk_rol = :fk_rol
                  WHERE id = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':identificacion', $this->identificacion, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':apellido', $this->apellido);
        $stmt->bindParam(':fecha_nacimiento', $this->fecha_nacimiento);
        $stmt->bindParam(':telefono', $this->telefono);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':area_desarrollo', $this->area_desarrollo);
        $stmt->bindParam(':fk_rol', $this->fk_rol, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar usuario: " . $error[2]);
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
            die("Error al eliminar usuario: " . $error[2]);
        }
    }


    public function getByEmail($email) {
        $query = "SELECT * FROM $this->table WHERE email = :email LIMIT 1";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':email', $email);
        if ($stmt->execute()) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            return null;
        }
    }
    
}
?>
