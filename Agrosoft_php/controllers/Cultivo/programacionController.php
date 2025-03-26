<?php
require_once   './config/database.php';
require_once './models/Cultivo/programacionModel.php';

class ProgramacionController {
    private $db;
    private $programacion;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->programacion = new Programacion($this->db);
    }

    public function getTodos(){
        $stmt = $this->programacion->getAll();
        $programaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $programaciones
        ]);
    }

    public function getPorId($id){
        $programacionData = $this->programacion->getById($id);
        if ($programacionData) {
            echo json_encode([
                'status' => 200,
                'data' => $programacionData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Programación no encontrada'
            ]);
        }
    }

    public function crear($data){
        $this->programacion->ubicacion = isset($data['ubicacion']) ? $data['ubicacion'] : null;
        $this->programacion->estado = isset($data['estado']) ? $data['estado'] : null;
        $this->programacion->fecha_prog = isset($data['fecha_prog']) ? $data['fecha_prog'] : null;

        if (!$this->programacion->ubicacion || !$this->programacion->estado || !$this->programacion->fecha_prog) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos requeridos'
            ]);
            return;
        }

        $newId = $this->programacion->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Programación creada exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingProgramacion = $this->programacion->getById($id);
        if (!$existingProgramacion) {
            echo json_encode([
                'status' => 404,
                'message' => 'Programación no encontrada'
            ]);
            return;
        }

        $this->programacion->id_programacion = $id;
        $this->programacion->ubicacion = isset($data['ubicacion']) ? $data['ubicacion'] : $existingProgramacion['ubicacion'];
        $this->programacion->estado = isset($data['estado']) ? $data['estado'] : $existingProgramacion['estado'];
        $this->programacion->fecha_prog = isset($data['fecha_prog']) ? $data['fecha_prog'] : $existingProgramacion['fecha_prog'];

        if ($this->programacion->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Programación actualizada exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingProgramacion = $this->programacion->getById($id);
        if (!$existingProgramacion) {
            echo json_encode([
                'status' => 404,
                'message' => 'Programación no encontrada'
            ]);
            return;
        }

        $this->programacion->id_programacion = $id;
        if ($this->programacion->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Programación eliminada exitosamente'
            ]);
        }
    }
}
