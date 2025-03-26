<?php
require_once   './config/database.php';
require_once './models/IoT/datosMeteorologicosModel.php';

class DatosMeteorologicosController {
    private $db;
    private $datosMeteorologicos;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->datosMeteorologicos = new DatosMeteorologicos($this->db);
    }

    public function getTodos(){
        $stmt = $this->datosMeteorologicos->getAll();
        $datos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $datos
        ]);
    }

    public function getPorId($id){
        $dato = $this->datosMeteorologicos->getById($id);
        if ($dato) {
            echo json_encode([
                'status' => 200,
                'data' => $dato
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Dato meteorológico no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->datosMeteorologicos->id_dato_meteorologico = isset($data['id_dato_meteorologico']) ? $data['id_dato_meteorologico'] : null;
        $this->datosMeteorologicos->fecha_hora = isset($data['fecha_hora']) ? $data['fecha_hora'] : null;
        $this->datosMeteorologicos->tipo_dato = isset($data['tipo_dato']) ? $data['tipo_dato'] : null;
        $this->datosMeteorologicos->valor = isset($data['valor']) ? $data['valor'] : null;
        $this->datosMeteorologicos->fk_sensor_bancal = isset($data['fk_sensor_bancal']) ? $data['fk_sensor_bancal'] : null;

        if (!$this->datosMeteorologicos->id_dato_meteorologico || !$this->datosMeteorologicos->fk_sensor_bancal) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos requeridos'
            ]);
            return;
        }

        $newId = $this->datosMeteorologicos->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Dato meteorológico creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingDato = $this->datosMeteorologicos->getById($id);
        if (!$existingDato) {
            echo json_encode([
                'status' => 404,
                'message' => 'Dato meteorológico no encontrado'
            ]);
            return;
        }

        $this->datosMeteorologicos->id_dato_meteorologico = $id;
        $this->datosMeteorologicos->fecha_hora = isset($data['fecha_hora']) ? $data['fecha_hora'] : $existingDato['fecha_hora'];
        $this->datosMeteorologicos->tipo_dato = isset($data['tipo_dato']) ? $data['tipo_dato'] : $existingDato['tipo_dato'];
        $this->datosMeteorologicos->valor = isset($data['valor']) ? $data['valor'] : $existingDato['valor'];
        $this->datosMeteorologicos->fk_sensor_bancal = isset($data['fk_sensor_bancal']) ? $data['fk_sensor_bancal'] : $existingDato['fk_sensor_bancal'];

        if ($this->datosMeteorologicos->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Dato meteorológico actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingDato = $this->datosMeteorologicos->getById($id);
        if (!$existingDato) {
            echo json_encode([
                'status' => 404,
                'message' => 'Dato meteorológico no encontrado'
            ]);
            return;
        }

        $this->datosMeteorologicos->id_dato_meteorologico = $id;
        if ($this->datosMeteorologicos->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Dato meteorológico eliminado exitosamente'
            ]);
        }
    }
}
?>
