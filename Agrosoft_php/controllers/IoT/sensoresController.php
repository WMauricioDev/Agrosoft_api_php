<?php
require_once   './config/database.php';
require_once './models/IoT/sensorBancal.php';

class SensorController {
    private $db;
    private $sensor;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->sensor = new Sensores($this->db);
    }

    public function getTodos() {
        $stmt = $this->sensor->getAll();
        $sensors = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($sensors);
    }

    public function getPorId($id) {
        $sensor = $this->sensor->getById($id);
        if ($sensor) {
            echo json_encode($sensor);
        } else {
            echo json_encode(["message" => "Sensor no encontrado"]);
        }
    }

    public function create($data) {
        $this->sensor->nombre = $data['nombre'];
        $this->sensor->tipo_sensor = $data['tipo_sensor'];
        $this->sensor->unidad_medida = $data['unidad_medida'];
        $this->sensor->medida_min = $data['medida_min'];
        $this->sensor->medida_max = $data['medida_max'];

        if ($this->sensor->create()) {
            echo json_encode(["message" => "Sensor creado"]);
        } else {
            echo json_encode(["message" => "Error al crear sensor"]);
        }
    }

    public function actualizar($id, $data) {
        $this->sensor->id_sensor = $id;
        $this->sensor->nombre = $data['nombre'];
        $this->sensor->tipo_sensor = $data['tipo_sensor'];
        $this->sensor->unidad_medida = $data['unidad_medida'];
        $this->sensor->medida_min = $data['medida_min'];
        $this->sensor->medida_max = $data['medida_max'];

        if ($this->sensor->update()) {
            echo json_encode(["message" => "Sensor actualizado"]);
        } else {
            echo json_encode(["message" => "Error al actualizar sensor"]);
        }
    }

    public function eliminar($id) {
        $this->sensor->id_sensor = $id;
        if ($this->sensor->delete()) {
            echo json_encode(["message" => "Sensor eliminado"]);
        } else {
            echo json_encode(["message" => "Error al eliminar sensor"]);
        }
    }
}
?>
