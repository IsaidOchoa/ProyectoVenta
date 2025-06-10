<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/usuariosController.php';
require_once __DIR__ . '/../../vendor/autoload.php'; // <-- Solo si usas Composer
require_once __DIR__ . '/../../middleware/Cors.php';
require_once __DIR__ . '/../../middleware/LoggingMiddleware.php';

Cors::permitirOrigen();
LoggingMiddleware::registrarSolicitud();

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER["REQUEST_METHOD"];

$basePath = '/ProyectoVenta/public';
if (strpos($request_uri, $basePath) === 0) {
    $request_uri = substr($request_uri, strlen($basePath));
}

file_put_contents(__DIR__ . '/debug_registro.log', "INICIO rutas | URI: $request_uri | METHOD: $request_method\n", FILE_APPEND);

if (strpos($request_uri, '/api/usuarios') === 0) {
    file_put_contents(__DIR__ . '/debug_registro.log', "Coincide /api/usuarios\n", FILE_APPEND);
    if ($request_method === "POST" && $request_uri === '/api/usuarios/registrar') {
        file_put_contents(__DIR__ . '/debug_registro.log', "Llama a UsuariosController::register()\n", FILE_APPEND);
        UsuariosController::register();
    } elseif ($request_method === "POST" && $request_uri === '/api/usuarios/login') {
        file_put_contents(__DIR__ . '/debug_registro.log', "Llama a UsuariosController::login()\n", FILE_APPEND);
        UsuariosController::login();
    } elseif ($request_method === "GET" && $request_uri === '/api/usuarios') {
        file_put_contents(__DIR__ . '/debug_registro.log', "Llama a UsuariosController::getAll()\n", FILE_APPEND);
        UsuariosController::getAll();
    } elseif ($request_method === "GET" && preg_match('#^/api/usuarios/(\d+)$#', $request_uri, $matches)) {
        file_put_contents(__DIR__ . '/debug_registro.log', "Llama a UsuariosController::getById()\n", FILE_APPEND);
        UsuariosController::getById($matches[1]);
    } elseif ($request_method === "PUT" && preg_match('#^/api/usuarios/(\d+)$#', $request_uri, $matches)) {
        file_put_contents(__DIR__ . '/debug_registro.log', "Llama a UsuariosController::update()\n", FILE_APPEND);
        UsuariosController::update($matches[1]);
    } elseif ($request_method === "PUT" && preg_match('#^/api/usuarios/(\d+)/estado$#', $request_uri, $matches)) {
        file_put_contents(__DIR__ . '/debug_registro.log', "Llama a UsuariosController::toggleEstado()\n", FILE_APPEND);
        UsuariosController::toggleEstado($matches[1]);
    } else {
        file_put_contents(__DIR__ . '/debug_registro.log', "Ruta no encontrada en usuarios\n", FILE_APPEND);
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["error" => "Ruta no encontrada en usuarios"]);
    }
}
file_put_contents(__DIR__ . '/debug_registro.log', "FIN rutas\n", FILE_APPEND);
?>