<?php
class DatosMeteorologicos {
    private $connect;
    private $table = "Datos_Meteorologicos";
    
    public $id_dato_meteorologico;
    public $fecha_hora;
    public $tipo_dato;
    public $valor;
    public $fk_sensor_bancal;

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
        $query = "SELECT * FROM $this->table WHERE id_dato_meteorologico = :id LIMIT 1";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        if ($stmt->execute()) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $error = $stmt->errorInfo();
            die("Error en la consulta: " . $error[2]);
        }
    }

    public function create() {
        $query = "INSERT INTO $this->table (id_dato_meteorologico, fecha_hora, tipo_dato, valor, fk_sensor_bancal) VALUES (:id_dato_meteorologico, :fecha_hora, :tipo_dato, :valor, :fk_sensor_bancal)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':id_dato_meteorologico', $this->id_dato_meteorologico);
        $stmt->bindParam(':fecha_hora', $this->fecha_hora);
        $stmt->bindParam(':tipo_dato', $this->tipo_dato, PDO::PARAM_INT);
        $stmt->bindParam(':valor', $this->valor, PDO::PARAM_INT);
        $stmt->bindParam(':fk_sensor_bancal', $this->fk_sensor_bancal, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al crear dato meteorológico: " . $error[2]);
        }
    }

    public function update() {
        $query = "UPDATE $this->table SET fecha_hora = :fecha_hora, tipo_dato = :tipo_dato, valor = :valor, fk_sensor_bancal = :fk_sensor_bancal WHERE id_dato_meteorologico = :id";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fecha_hora', $this->fecha_hora);
        $stmt->bindParam(':tipo_dato', $this->tipo_dato, PDO::PARAM_INT);
        $stmt->bindParam(':valor', $this->valor, PDO::PARAM_INT);
        $stmt->bindParam(':fk_sensor_bancal', $this->fk_sensor_bancal, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id_dato_meteorologico);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al actualizar dato meteorológico: " . $error[2]);
        }
    }

    public function delete() {
        $query = "DELETE FROM $this->table WHERE id_dato_meteorologico = :id";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':id', $this->id_dato_meteorologico);

        if ($stmt->execute()) {
            return true;
        } else {
            $error = $stmt->errorInfo();
            die("Error al eliminar dato meteorológico: " . $error[2]);
        }
    }
}
?>
