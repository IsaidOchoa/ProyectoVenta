<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Content-Type: application/json'); // <-- Mueve esto arriba, antes de cualquier salida

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../services/ProductoService.php';
require_once __DIR__ . '/../services/CompraService.php';
require_once __DIR__ . '/../services/UsuarioService.php';
require_once __DIR__ . '/../config/db.php';

class ComprasController {

    public static function realizarCompra() {
        ini_set('display_errors', 1);
        error_reporting(E_ALL);

        $logFile = __DIR__ . '/debug.log';
        file_put_contents($logFile, "INICIO realizarCompra MODULAR\n");

        $db = (new Database())->getConnection();
        if (!$db) {
            file_put_contents($logFile, "Error: No se pudo conectar a la base de datos\n", FILE_APPEND);
            http_response_code(500);
            echo json_encode(["error" => "No se pudo conectar a la base de datos"]);
            exit;
        }

        $cart = json_decode(file_get_contents("php://input"), true);
        file_put_contents($logFile, "Payload recibido: " . print_r($cart, true), FILE_APPEND);

        if (empty($cart) || !isset($cart['productos'])) {
            file_put_contents($logFile, "Error: Datos incompletos\n", FILE_APPEND);
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos para actualizar stock"]);
            exit;
        }

        try {
            $usuario_id = $cart['usuario_id']; // <-- AGREGA ESTA LÍNEA
            $productos = $cart['productos'];
            // 1. Calcular total
            $total = 0;
            foreach ($productos as $item) {
                $stmt = $db->prepare("SELECT nombre, precio FROM productos WHERE id = ?");
                $stmt->execute([$item['id']]);
                $prod = $stmt->fetch(PDO::FETCH_ASSOC);
                $total += $prod['precio'] * $item['cantidad'];
            }

            // 2. Insertar en ventas
            $stmt = $db->prepare("INSERT INTO ventas (usuario_id, total) VALUES (?, ?)");
            $stmt->execute([$usuario_id, $total]);
            $venta_id = $db->lastInsertId();

            // 3. Insertar en venta_detalle y actualizar stock
            foreach ($productos as $item) {
                $stmt = $db->prepare("SELECT nombre, precio FROM productos WHERE id = ?");
                $stmt->execute([$item['id']]);
                $prod = $stmt->fetch(PDO::FETCH_ASSOC);

                $stmt = $db->prepare("INSERT INTO venta_detalle (venta_id, producto_id, nombre_producto_snapshot, precio_unitario, cantidad, total)
                    VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $venta_id,
                    $item['id'],
                    $prod['nombre'],
                    $prod['precio'],
                    $item['cantidad'],
                    $prod['precio'] * $item['cantidad']
                ]);

                // Actualizar stock
                ProductoService::actualizarStock($db, $item['id'], -$item['cantidad']);
            }

            // Vaciar carrito del usuario
            $stmt = $db->prepare("DELETE FROM carrito WHERE usuario_id = ?");
            $stmt->execute([$usuario_id]);

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Compra realizada correctamente"
            ]);
            file_put_contents($logFile, "FIN OK\n", FILE_APPEND);
        } catch (Exception $e) {
            file_put_contents($logFile, "ERROR: " . $e->getMessage() . " en línea " . $e->getLine() . "\n", FILE_APPEND);
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "error" => $e->getMessage(),
                "line" => $e->getLine(),
                "file" => $e->getFile()
            ]);
        }
        exit; // <-- Asegúrate de terminar aquí para evitar cualquier salida extra
    }

    public static function historialPorUsuario($usuario_id) {
        $db = (new Database())->getConnection();
        $stmt = $db->prepare("SELECT id, total, fecha, estado FROM ventas WHERE usuario_id = ? ORDER BY fecha DESC");
        $stmt->execute([$usuario_id]);
        $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($ventas);
        exit;
    }

    public static function detalleVenta($venta_id) {
        $db = (new Database())->getConnection();
        $stmt = $db->prepare("SELECT nombre_producto_snapshot, precio_unitario, cantidad, total FROM venta_detalle WHERE venta_id = ?");
        $stmt->execute([$venta_id]);
        $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($detalles);
        exit;
    }

    public static function eliminarVenta($ventaId) {
        $db = (new Database())->getConnection();
        return CompraService::eliminarCompra($db, $ventaId);
    }

    public static function eliminarHistorialUsuario($usuarioId) {
        $db = (new Database())->getConnection();
        return CompraService::eliminarHistorial($db, $usuarioId);
    }
}

?>
