<?php
require_once './config/database.php';
require_once './models/Usuarios/usuarioModel.php';
require_once './vendor/autoload.php';
require_once   './config/jwt.php';


use Firebase\JWT\JWT;

class AuthController {
    private $db;
    private $usuario;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuario = new Usuario($this->db);
    }

    public function login($data) {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $usuarioData = $this->usuario->getByEmail($email);

        if ($usuarioData && password_verify($password, $usuarioData['password'])) {
            $payload = [
                'iss' => 'tu_dominio.com',
                'aud' => 'tu_dominio.com',
                'iat' => time(),
                'exp' => time() + (60 * 60),
                'data' => [
                    'id' => $usuarioData['id'],
                    'email' => $usuarioData['email'],
                    'rol' => $usuarioData['fk_rol']
                ]
            ];

            $jwt = JWT::encode($payload, JWT_SECRET, 'HS256');

            echo json_encode([
                'status' => 200,
                'message' => 'Login exitoso',
                'token' => $jwt
            ]);
        } else {
            echo json_encode([
                'status' => 401,
                'message' => 'Credenciales incorrectas'
            ]);
        }
    }
}
?>
