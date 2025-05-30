<?php
require_once __DIR__ . '/../controllers/carritoController.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

if (preg_match('#/api/carrito/(\d+)$#', $uri, $matches)) {
    $usuario_id = $matches[1];
    if ($method === 'GET') {
        CarritoController::getCarrito($usuario_id);
    } elseif ($method === 'POST') {
        CarritoController::addOrUpdateProducto($usuario_id);
    } elseif ($method === 'DELETE') {
        CarritoController::vaciarCarrito($usuario_id);
    }
} elseif (preg_match('#/api/carrito/(\d+)/(\d+)$#', $uri, $matches)) {
    $usuario_id = $matches[1];
    $producto_id = $matches[2];
    if ($method === 'DELETE') {
        CarritoController::removeProducto($usuario_id, $producto_id);
    }
}