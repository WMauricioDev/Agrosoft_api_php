<?php
require_once   './config/database.php';
require_once './models/Usuarios/RolModel.php';

class RolesController {
    private $db;
    private $role;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->role = new Rol($this->db);
    }

    public function getTodos(){
        $stmt = $this->role->getAll();
        $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $roles
        ]);
    }

    public function getPorId($id){
        $roleData = $this->role->getById($id);
        if ($roleData) {
            echo json_encode([
                'status' => 200,
                'data' => $roleData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Rol no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->role->nombre_rol = isset($data['nombre_rol']) ? $data['nombre_rol'] : null;
        
        if (!$this->role->nombre_rol) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos requeridos'
            ]);
            return;
        }

        $newId = $this->role->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Rol creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingRole = $this->role->getById($id);
        if (!$existingRole) {
            echo json_encode([
                'status' => 404,
                'message' => 'Rol no encontrado'
            ]);
            return;
        }

        $this->role->id = $id;
        $this->role->nombre_rol = isset($data['nombre_rol']) ? $data['nombre_rol'] : $existingRole['nombre_rol'];

        if ($this->role->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Rol actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingRole = $this->role->getById($id);
        if (!$existingRole) {
            echo json_encode([
                'status' => 404,
                'message' => 'Rol no encontrado'
            ]);
            return;
        }

        $this->role->id = $id;
        if ($this->role->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Rol eliminado exitosamente'
            ]);
        }
    }
}
?>
