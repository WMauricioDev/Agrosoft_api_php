<?php
require_once "../Agrosoft_php/autoload.php";

$request = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$resource = strtolower($request[1]);
$id = isset($request[2]) ? (int)$request[2] : null;
$action = $_SERVER['REQUEST_METHOD'];

$controllerName = ucfirst($resource) . "Controller";

if (class_exists($controllerName)) {
    $controller = new $controllerName();

    switch ($action) {
        case "GET":
            if ($controllerName === "AuthController") {
                echo json_encode(["status" => 400, "message" => "Método GET no permitido en AuthController"]);
            } else {
                $id ? $controller->getPorId($id) : $controller->getTodos();
            }
            break;
        case "POST":
            $data = json_decode(file_get_contents("php://input"), true);
            if ($controllerName === "AuthController") {
                $controller->login($data);
            } else {
                $controller->crear($data);
            }
            break;
        case "PUT":
            if ($id) {
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->actualizar($id, $data);
            } else {
                echo json_encode(["status" => 400, "message" => "ID requerido para actualizar"]);
            }
            break;
        case "DELETE":
            if ($id) {
                $controller->eliminar($id);
            } else {
                echo json_encode(["status" => 400, "message" => "ID requerido para eliminar"]);
            }
            break;
        default:
            echo json_encode(["status" => 405, "message" => "Método no permitido"]);
    }
} else {
    echo json_encode(["status" => 404, "message" => "Controlador no encontrado"]);
}

?>
