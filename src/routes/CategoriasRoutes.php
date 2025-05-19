<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../middleware/Cors.php';
require_once __DIR__ . '/../../middleware/LoggingMiddleware.php';
require_once __DIR__ . '/../controllers/CategoriasController.php';

header('Content-Type: application/json');

// Normaliza la ruta
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER["REQUEST_METHOD"];
$basePath = '/ProyectoVenta/public';
if (strpos($request_uri, $basePath) === 0) {
    $request_uri = substr($request_uri, strlen($basePath));
}

// Aplica middlewares globales
Cors::permitirOrigen();
LoggingMiddleware::registrarSolicitud();

// Procesar solo rutas que comiencen con /api/categorias
if (strpos($request_uri, '/api/categorias') === 0) {
    // Rutas de categorías
    if ($request_method === "GET" && ($request_uri === '/api/categorias' || $request_uri === '/api/categorias/')) {
        CategoriasController::index();
    } else {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["error" => "Ruta no encontrada en categorias"]);
    }
}
?>