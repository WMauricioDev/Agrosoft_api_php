<?php
require_once   './config/database.php';
require_once './models/Cultivo/loteModel.php';

class loteController {
    private $db;
    private $lote;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->lote = new Lote($this->db);
    }

    public function getTodos(){
        $stmt = $this->lote->getAll();
        $lotes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $lotes
        ]);
    }
    public function getPorId($id){
        $loteData = $this->lote->getById($id);
        if ($loteData) {
            echo json_encode([
                'status' => 200,
                'data'=> $loteData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'data' => 'Lote no encontrado'
            ]);
        }
        
    }

    public function crear($data) {
        $this->lote->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->lote->descripcion = isset($data['descripcion']) ? $data['descripcion'] : null;
        $this->lote->tamx = isset($data['tamx']) ? $data['tamx'] : null;
        $this->lote->estado = isset($data['estado']) ? $data['estado'] : null;
        $this->lote->tamy = isset($data['tamy']) ? $data['tamy'] : null;
        $this->lote->posx = isset($data['posx']) ? $data['posx'] : null;
        $this->lote->posy = isset($data['posy']) ? $data['posy'] : null;
    
        if (!$this->lote->nombre) {
            echo json_encode([
                'status' => 400,
                'message' => 'No se ha ingresado un nombre del lote'
            ]);
            return;
        }
    
        try {
            $newId = $this->lote->create();
            echo json_encode([
                'status' => 200,
                'message' => 'Lote registrado correctamente',
                'id' => $newId
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'status' => 500,
                'message' => 'Error al registrar el lote: ' . $e->getMessage()
            ]);
        }
    }   
    public function actualizar($id, $data){
        $existeLote = $this->lote->getById($id);
        if (!$existeLote) {
            echo json_encode([
                'status' => 404,
                'message' => 'Lote no encontrado'
            ]);
            return;
        }
        $this->lote->id = $id;
        $this->lote->nombre = isset($data['nombre']) ? $data['nombre'] : $existeLote['nombre'];
        $this->lote->descripcion = isset($data['descripcion']) ? $data['descripcion'] : $existeLote['descripcion'];
        $this->lote->tamx = isset($data['tamx']) ? $data['tamx'] : $existeLote['tamx'];
        $this->lote->tamy = isset($data['tamy']) ? $data['tamy'] :  $existeLote['tamy'];
        $this->lote->estado = isset($data['estado']) ? $data['estado'] : $existeLote['estado'];
        $this->lote->posx = isset($data['posx']) ? $data['posx'] :  $existeLote['posx'];
        $this->lote->posy = isset($data['posy']) ? $data['posy'] :  $existeLote['posy'];

        if ($this->lote->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'lote registrado correctamente'
            ]);
        }
    }

    public function eliminar($id){
        $existeLote = $this->lote->getById($id);
        if (!$existeLote) {
            echo json_encode([
                'status' => 404,
                'message' => 'lote no encontrado'
            ]);
        }
        $this->lote->id = $id;
        if ($this->lote->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Lote eliminado correctamente'
            ]);
        }
    }
}
?>
