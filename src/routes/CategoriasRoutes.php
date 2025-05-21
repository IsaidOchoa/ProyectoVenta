<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/CategoriasController.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../middleware/Cors.php';
require_once __DIR__ . '/../../middleware/LoggingMiddleware.php';

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
    // Obtener todas las categorías
    if ($request_method === "GET" && ($request_uri === '/api/categorias' || $request_uri === '/api/categorias/')) {
        CategoriasController::index();
        exit;
    }

    // Obtener una categoría por ID
    if ($request_method === "GET" && preg_match('#^/api/categorias/(\d+)$#', $request_uri, $matches)) {
        $id = $matches[1];
        CategoriasController::show($id);
        exit;
    }

    // Crear una nueva categoría
    if ($request_method === "POST" && ($request_uri === '/api/categorias' || $request_uri === '/api/categorias/')) {
        CategoriasController::store();
        exit;
    }

    // Actualizar una categoría existente
    if ($request_method === "PUT" && preg_match('#^/api/categorias/(\d+)$#', $request_uri, $matches)) {
        $id = $matches[1];
        CategoriasController::update($id);
        exit;
    }

    // Eliminar una categoría
    if ($request_method === "DELETE" && preg_match('#^/api/categorias/(\d+)$#', $request_uri, $matches)) {
        $id = $matches[1];
        CategoriasController::destroy($id);
        exit;
    }

    // Si ninguna ruta coincide
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["error" => "Ruta no encontrada en categorias"]);
}
