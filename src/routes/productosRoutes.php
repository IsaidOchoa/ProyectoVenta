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

require_once __DIR__ . '/../controllers/productosController.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../middleware/Cors.php';
require_once __DIR__ . '/../../middleware/LoggingMiddleware.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER["REQUEST_METHOD"];

// Normaliza la ruta
$basePath = '/ProyectoVenta/public';
if (strpos($request_uri, $basePath) === 0) {
    $request_uri = substr($request_uri, strlen($basePath));
}

// Aplica middlewares globales
Cors::permitirOrigen();
LoggingMiddleware::registrarSolicitud();

// Procesar solo rutas que comiencen con /api/productos
if (strpos($request_uri, '/api/productos') === 0) {
    // Rutas de productos
    if ($request_method === "POST" && $request_uri === '/api/productos/Crear') {
        AuthMiddleware::verificarToken(); // Ejemplo: solo usuarios autenticados pueden crear
        ProductosController::create();
    } elseif ($request_method === "DELETE" && preg_match('/\/api\/productos\/Eliminar\/(\d+)/', $request_uri, $matches)) {
        AuthMiddleware::verificarToken();
        $id = filter_var($matches[1], FILTER_VALIDATE_INT);
        if (!$id) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "ID inválido"]);
            exit;
        }
        ProductosController::delete($id);
    } elseif ($request_method === "PUT" && preg_match('/\/api\/productos\/Modificar\/(\d+)/', $request_uri, $matches)) {
        AuthMiddleware::verificarToken();
        $id = filter_var($matches[1], FILTER_VALIDATE_INT);
        if (!$id) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "ID inválido"]);
            exit;
        }
        ProductosController::update($id);
    } elseif ($request_method === "POST" && preg_match('/\/api\/productos\/Modificar\/(\d+)/', $request_uri, $matches)) {
        AuthMiddleware::verificarToken();
        $id = filter_var($matches[1], FILTER_VALIDATE_INT);
        if (!$id) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "ID inválido"]);
            exit;
        }
        ProductosController::update($id);
    } elseif ($request_method === "GET" && $request_uri === '/api/productos') {
        ProductosController::index();
    } elseif ($request_method === "GET" && preg_match('/\/api\/productos\/(\d+)/', $request_uri, $matches)) {
        $id = filter_var($matches[1], FILTER_VALIDATE_INT);
        if (!$id) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "ID inválido"]);
            exit;
        }
        ProductosController::show($id);
    } else {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["error" => "Ruta no encontrada en productos"]);
    }
}
?>