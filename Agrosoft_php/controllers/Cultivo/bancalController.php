    <?php

    require_once   './config/database.php';
    require_once './models/Cultivo/bancalModel.php';

class bancalController{
    private $db;
    private $bancal;

    public function __construct() {
        $database = new Database;
        $this->db = $database->getConnection();
        $this->bancal = new Bancal($this->db);
    }

    public function getTodos(){
        $stmt = $this->bancal->getAll();
        $bancales = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $bancales
        ]);
    }

    public function getPorId($id){
        $bancalData = $this->bancal->getById($id);
        if ($bancalData) {
            echo json_encode([
                'status' => 200,
                'data' => $bancalData
            ]);
        }else{
            echo json_encode([
                'status' => 404,
                'data' => 'bancal no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->bancal->fk_lote = isset($data['fk_lote']) ? $data['fk_lote'] : null;
        $this->bancal->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->bancal->tamx = isset($data['tamx']) ? $data['tamx'] : null;
        $this->bancal->tamy = isset($data['tamy']) ? $data['tamy'] : null;
        $this->bancal->posx = isset($data['posx']) ? $data['posx'] : null;
        $this->bancal->posy = isset($data['posy']) ? $data['posy'] : null;
        if (!$this->bancal->tamx) {
            echo json_encode([
                'status' => 404,
                'message' => 'Faltan campos por completar'
            ]);
            return;
        }
        $newId = $this->bancal->create();
        echo json_encode([
            'status' => 200,
            'message' => 'Bancal creado con exito',
            'id' => $newId
        ]);

    }

    public function actualizar($id, $data) {
        $existeBancal = $this->bancal->getById($id);
        if (!$existeBancal) {
            echo json_encode([
                'status' => 404,
                'message' => 'No se encontró el bancal'
            ]);
            return;
        }
    
        $this->bancal->id = $id;
    
        $this->bancal->fk_lote = isset($data['fk_lote']) ? $data['fk_lote'] : $existeBancal['fk_lote'];
        $this->bancal->nombre = isset($data['nombre']) ? $data['nombre'] : $existeBancal['nombre'];
        $this->bancal->tamx = isset($data['tamx']) ? $data['tamx'] : $existeBancal['tamx'];
        $this->bancal->tamy = isset($data['tamy']) ? $data['tamy'] : $existeBancal['tamy'];
        $this->bancal->posx = isset($data['posx']) ? $data['posx'] : $existeBancal['posx'];
        $this->bancal->posy = isset($data['posy']) ? $data['posy'] : $existeBancal['posy'];
    
         if ($this->bancal->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Bancal actualizado correctamente'
            ]);
        } else {
            echo json_encode([
                'status' => 500,
                'message' => 'Error al actualizar el bancal'
            ]);
        }
    }

    public function eliminar($id){
        $existeBancal = $this->bancal->getById($id);
        if (!$existeBancal) {
            echo json_encode([
                'status' => 404,
                'Message' => 'No se encontro un bancal'
            ]);
        }
        $this->bancal->id = $id;

        if ($this->bancal->delete()) {
            echo json_encode([
                'status' => 200,
                'Message' => 'Bancal eliminado correctamente'
            ]);
        }
    }
   

}