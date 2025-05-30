<?php
require_once __DIR__ . '/../services/CarritoService.php';

class CarritoController {
    public static function getCarrito($usuario_id) {
        $db = (new Database())->getConnection();
        $productos = CarritoService::obtenerCarrito($db, $usuario_id);
        echo json_encode(['productos' => $productos]);
        exit;
    }

    public static function addOrUpdateProducto($usuario_id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $producto_id = $input['producto_id'];
        $cantidad = $input['cantidad'];
        $db = (new Database())->getConnection();
        CarritoService::agregarActualizar($db, $usuario_id, $producto_id, $cantidad);
        echo json_encode(['success' => true]);
        exit;
    }

    public static function removeProducto($usuario_id, $producto_id) {
        $db = (new Database())->getConnection();
        CarritoService::eliminarProducto($db, $usuario_id, $producto_id);
        echo json_encode(['success' => true]);
        exit;
    }

    public static function vaciarCarrito($usuario_id) {
        $db = (new Database())->getConnection();
        CarritoService::vaciarCarrito($db, $usuario_id);
        echo json_encode(['success' => true]);
        exit;
    }
}