<?php
require_once   './config/database.php';
require_once './models/Finanzas/salarioMinimoModel.php';

class SalarioMinimoController {
    private $db;
    private $salarioMinimo;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->salarioMinimo = new SalarioMinimo($this->db);
    }

    public function getTodos(){
        $stmt = $this->salarioMinimo->getAll();
        $salarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $salarios
        ]);
    }

    public function getPorId($id){
        $salarioData = $this->salarioMinimo->getById($id);
        if ($salarioData) {
            echo json_encode([
                'status' => 200,
                'data' => $salarioData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Registro no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->salarioMinimo->valor = isset($data['valor']) ? $data['valor'] : null;
        $this->salarioMinimo->fecha_aplicacion = isset($data['fecha_aplicacion']) ? $data['fecha_aplicacion'] : null;

        if (!$this->salarioMinimo->valor || !$this->salarioMinimo->fecha_aplicacion) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos requeridos'
            ]);
            return;
        }

        $newId = $this->salarioMinimo->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Registro creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingSalario = $this->salarioMinimo->getById($id);
        if (!$existingSalario) {
            echo json_encode([
                'status' => 404,
                'message' => 'Registro no encontrado'
            ]);
            return;
        }

        $this->salarioMinimo->id = $id;
        $this->salarioMinimo->valor = isset($data['valor']) ? $data['valor'] : $existingSalario['valor'];
        $this->salarioMinimo->fecha_aplicacion = isset($data['fecha_aplicacion']) ? $data['fecha_aplicacion'] : $existingSalario['fecha_aplicacion'];

        if ($this->salarioMinimo->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Registro actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingSalario = $this->salarioMinimo->getById($id);
        if (!$existingSalario) {
            echo json_encode([
                'status' => 404,
                'message' => 'Registro no encontrado'
            ]);
            return;
        }

        $this->salarioMinimo->id = $id;
        if ($this->salarioMinimo->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Registro eliminado exitosamente'
            ]);
        }
    }
}
?>