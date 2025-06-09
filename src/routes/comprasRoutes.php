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

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request_method = $_SERVER["REQUEST_METHOD"];

// 🔧 Normalizar la URI quitando /ProyectoVenta/public si viene desde ahí
$request_uri = str_replace('/ProyectoVenta/public', '', $request_uri);

// Logging personalizado
file_put_contents(__DIR__ . '/debug.log', "INICIO rutas | URI: $request_uri | METHOD: $request_method\n", FILE_APPEND);

// Procesar solo rutas que comiencen con /api/compras
if (strpos($request_uri, '/api/compras') === 0) {

    if ($request_method === "POST" && $request_uri === '/api/compras/realizar') {
        file_put_contents(__DIR__ . '/debug.log', "Coincide realizar compra\n", FILE_APPEND);
        ComprasController::realizarCompra();
        exit;
    }

    if ($request_method === "POST" && $request_uri === '/api/compras/carrito/agregar') {
        file_put_contents(__DIR__ . '/debug.log', "Coincide /api/compras/carrito/agregar\n", FILE_APPEND);
        ComprasController::agregarProductoCarrito();
        exit;
    }

    if ($request_method === "GET" && $request_uri === '/api/compras/productos') {
        file_put_contents(__DIR__ . '/debug.log', "Coincide /api/compras/productos\n", FILE_APPEND);
        ComprasController::obtenerProductos();
        exit;
    }

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

    if ($request_method === "DELETE" && $request_uri === '/api/compras/carrito/vaciar') {
        file_put_contents(__DIR__ . '/debug.log', "Coincide vaciar carrito\n", FILE_APPEND);
        ComprasController::vaciarCarrito();
        exit;
    }

    if ($request_method === "GET" && preg_match('/\/api\/compras\/historial\/(\d+)/', $request_uri, $matches)) {
        ComprasController::historialPorUsuario($matches[1]);
        exit;
    }

    if ($request_method === "GET" && preg_match('/\/api\/compras\/detalle\/(\d+)/', $request_uri, $matches)) {
        ComprasController::detalleVenta($matches[1]);
        exit;
    }

    if ($request_method === "DELETE" && preg_match('/\/api\/compras\/eliminar\/(\d+)/', $request_uri, $matches)) {
        $ventaId = (int)$matches[1];
        $result = ComprasController::eliminarVenta($ventaId);
        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No se pudo eliminar']);
        }
        exit;
    }
    
    if ($request_method === "DELETE" && preg_match('/\/api\/compras\/historial\/(\d+)/', $request_uri, $matches)) {
        $usuarioId = $matches[1];
        if ($usuarioId && ComprasController::eliminarHistorialUsuario($usuarioId)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No se pudo eliminar el historial']);
        }
        exit;
    }

    // Ruta no encontrada dentro de /api/compras
    file_put_contents(__DIR__ . '/debug.log', "Ruta no encontrada dentro de /api/compras\n", FILE_APPEND);
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["error" => "Ruta no encontrada en compras"]);
    exit;
}

file_put_contents(__DIR__ . '/debug.log', "FIN rutas\n", FILE_APPEND);
