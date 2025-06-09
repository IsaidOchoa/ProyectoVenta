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

            ProductoService::actualizarStock($db, $productoId, -$cantidad);
        }

        return true;
    }

    public static function eliminarCompra($db, $ventaId) {
        try {
            $db->beginTransaction();
            $stmtDetalle = $db->prepare("DELETE FROM venta_detalle WHERE venta_id = ?");
            $stmtDetalle->execute([$ventaId]);
            $stmtVenta = $db->prepare("DELETE FROM ventas WHERE id = ?");
            $result = $stmtVenta->execute([$ventaId]);
            $db->commit();
            return $result;
        } catch (Exception $e) {
            $db->rollBack();
            return false;
        }
    }

    public static function eliminarHistorial($db, $usuarioId) {
        try {
            $db->beginTransaction();
            $stmtDetalle = $db->prepare("DELETE FROM venta_detalle WHERE venta_id IN (SELECT id FROM ventas WHERE usuario_id = ?)");
            $stmtDetalle->execute([$usuarioId]);
            $stmtVenta = $db->prepare("DELETE FROM ventas WHERE usuario_id = ?");
            $result = $stmtVenta->execute([$usuarioId]);
            $db->commit();
            return $result;
        } catch (Exception $e) {
            $db->rollBack();
            return false;
        }
    }
}
?>
