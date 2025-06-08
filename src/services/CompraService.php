<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/ProductoService.php';

class CompraService {
    public static function realizarCompra($db, $productos) {
        foreach ($productos as $item) {
            $productoId = $item['id'];
            $cantidad = $item['cantidad'];

            $producto = ProductoService::obtenerPorId($db, $productoId);
            if (!$producto || $producto['stock'] < $cantidad) {
                throw new Exception("Stock insuficiente para el producto con ID $productoId");
            }

            ProductoService::actualizarStock($db, $productoId, -$cantidad);
        }

        return true;
    }
}
?>
