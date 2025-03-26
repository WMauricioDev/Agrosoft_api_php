<?php
require_once   './config/database.php';
require_once './models/Usuarios/usuarioModel.php';
require_once __DIR__ . '/../middleware/middleware.php';

class UsuarioController {
    private $db;
    private $usuario;

    public function __construct(){
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuario = new Usuario($this->db);
    }
    public function getTodos() {
    
        $stmt = $this->usuario->getAll();
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 200,
            'data' => $usuarios
        ]);
    }
    
    
    
    public function getPorId($id){
    
        $usuarioData = $this->usuario->getById($id);
        if ($usuarioData) {
            echo json_encode([
                'status' => 200,
                'data' => $usuarioData
            ]);
        } else {
            echo json_encode([
                'status' => 404,
                'message' => 'Usuario no encontrado'
            ]);
        }
    }

    public function crear($data){
        $this->usuario->identificacion = isset($data['identificacion']) ? $data['identificacion'] : null;
        $this->usuario->nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $this->usuario->apellido = isset($data['apellido']) ? $data['apellido'] : null;
        $this->usuario->fecha_nacimiento = isset($data['fecha_nacimiento']) ? $data['fecha_nacimiento'] : null;
        $this->usuario->telefono = isset($data['telefono']) ? $data['telefono'] : null;
        $this->usuario->email = isset($data['email']) ? $data['email'] : null;
        $this->usuario->password = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : null;
        $this->usuario->area_desarrollo = isset($data['area_desarrollo']) ? $data['area_desarrollo'] : null;
        $this->usuario->fk_rol = isset($data['fk_rol']) ? $data['fk_rol'] : null;

        if (!$this->usuario->nombre || !$this->usuario->email || !$this->usuario->password) {
            echo json_encode([
                'status' => 400,
                'message' => 'Faltan datos obligatorios (nombre, email, password)'
            ]);
            return;
        }

        $newId = $this->usuario->create();
        echo json_encode([
            'status' => 201,
            'message' => 'Usuario creado exitosamente',
            'id' => $newId
        ]);
    }

    public function actualizar($id, $data){
        $existingUsuario = $this->usuario->getById($id);
        if (!$existingUsuario) {
            echo json_encode([
                'status' => 404,
                'message' => 'Usuario no encontrado'
            ]);
            return;
        }

        $this->usuario->id = $id;
        $this->usuario->identificacion = isset($data['identificacion']) ? $data['identificacion'] : $existingUsuario['identificacion'];
        $this->usuario->nombre = isset($data['nombre']) ? $data['nombre'] : $existingUsuario['nombre'];
        $this->usuario->apellido = isset($data['apellido']) ? $data['apellido'] : $existingUsuario['apellido'];
        $this->usuario->fecha_nacimiento = isset($data['fecha_nacimiento']) ? $data['fecha_nacimiento'] : $existingUsuario['fecha_nacimiento'];
        $this->usuario->telefono = isset($data['telefono']) ? $data['telefono'] : $existingUsuario['telefono'];
        $this->usuario->email = isset($data['email']) ? $data['email'] : $existingUsuario['email'];
        $this->usuario->password = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : $existingUsuario['password'];
        $this->usuario->area_desarrollo = isset($data['area_desarrollo']) ? $data['area_desarrollo'] : $existingUsuario['area_desarrollo'];
        $this->usuario->fk_rol = isset($data['fk_rol']) ? $data['fk_rol'] : $existingUsuario['fk_rol'];

        if ($this->usuario->update()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Usuario actualizado exitosamente'
            ]);
        }
    }

    public function eliminar($id){
        $existingUsuario = $this->usuario->getById($id);
        if (!$existingUsuario) {
            echo json_encode([
                'status' => 404,
                'message' => 'Usuario no encontrado'
            ]);
            return;
        }

        $this->usuario->id = $id;
        if ($this->usuario->delete()) {
            echo json_encode([
                'status' => 200,
                'message' => 'Usuario eliminado exitosamente'
            ]);
        }
    }
}
?>
