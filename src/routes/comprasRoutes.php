<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/comprasController.php';
require_once __DIR__ . '/../../middleware/Cors.php';
require_once __DIR__ . '/../../middleware/LoggingMiddleware.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request_method = $_SERVER["REQUEST_METHOD"];

// Logging personalizado para depuración
file_put_contents(__DIR__ . '/debug.log', "INICIO rutas | URI: $request_uri | METHOD: $request_method\n", FILE_APPEND);

LoggingMiddleware::registrarSolicitud();

// Procesar solo rutas que comiencen con /api/compras
if (strpos($request_uri, '/api/compras') === 0) {

    // Ruta específica para realizar una compra
    if ($request_method === "POST" && preg_match('#^/api/compras/realizar/?$#', $request_uri)) {
        file_put_contents(__DIR__ . '/debug.log', "Coincide /api/compras/realizar\n", FILE_APPEND);
        // AuthMiddleware::verificarToken(); // <-- comenta o elimina esta línea temporalmente
        ComprasController::realizarCompra();
        exit;
    }

    // Ruta para agregar un producto al carrito
    if ($request_method === "POST" && $request_uri === '/api/compras/carrito/agregar') {
        file_put_contents(__DIR__ . '/debug.log', "Coincide /api/compras/carrito/agregar\n", FILE_APPEND);
        ComprasController::agregarProductoCarrito();
        exit;
    }

    // Ruta para obtener los productos del carrito
    if ($request_method === "GET" && $request_uri === '/api/compras/productos') {
        file_put_contents(__DIR__ . '/debug.log', "Coincide /api/compras/productos\n", FILE_APPEND);
        ComprasController::obtenerProductos();
        exit;
    }

    // Ruta para eliminar un producto del carrito
    if ($request_method === "DELETE" && preg_match('/\/api\/compras\/carrito\/eliminar\/(\d+)/', $request_uri, $matches)) {
        $id = filter_var($matches[1], FILTER_VALIDATE_INT);
        if (!$id) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "ID inválido"]);
            exit;
        }
        file_put_contents(__DIR__ . '/debug.log', "Coincide eliminar producto del carrito: ID $id\n", FILE_APPEND);
        ComprasController::eliminarProductoCarrito($id);
        exit;
    }

    // Ruta para vaciar el carrito
    if ($request_method === "DELETE" && $request_uri === '/api/compras/carrito/vaciar') {
        file_put_contents(__DIR__ . '/debug.log', "Coincide vaciar carrito\n", FILE_APPEND);
        ComprasController::vaciarCarrito();
        exit;
    }

    // Ruta no encontrada dentro de /api/compras
    file_put_contents(__DIR__ . '/debug.log', "Ruta no encontrada dentro de /api/compras\n", FILE_APPEND);
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["error" => "Ruta no encontrada en compras"]);
    exit;
}

file_put_contents(__DIR__ . '/debug.log', "FIN rutas\n", FILE_APPEND);
