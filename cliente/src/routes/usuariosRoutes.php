<?php
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../controllers/usuariosController.php';
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

if (strpos($request_uri, '/api/usuarios') === 0) {
    if ($request_method === "POST" && $request_uri === '/api/usuarios/registrar') {
        UsuariosController::register();
    } elseif ($request_method === "POST" && $request_uri === '/api/usuarios/login') {
        UsuariosController::login();
    } else {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["error" => "Ruta no encontrada en usuarios"]);
    }
}
?>