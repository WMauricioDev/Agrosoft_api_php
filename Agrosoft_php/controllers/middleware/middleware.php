<?php
require_once  './config/jwt.php';
require_once  './vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function verificarToken() {
    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        echo json_encode(['status' => 401, 'message' => 'Token requerido']);
        exit();
    }

    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
        return $decoded->data;
    } catch (Exception $e) {
        echo json_encode(['status' => 401, 'message' => 'Token inválido']);
        exit();
    }
}


