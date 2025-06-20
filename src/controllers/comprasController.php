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

            // 2. Obtener el siguiente numero_ticket para el usuario
            $stmt = $db->prepare("SELECT IFNULL(MAX(numero_ticket), 0) + 1 AS next_ticket FROM ventas WHERE usuario_id = ?");
            $stmt->execute([$usuario_id]);
            $row = $stmt->fetch();
            $numero_ticket = $row['next_ticket'];

            // 3. Insertar la venta con el nuevo campo
            $stmt = $db->prepare("INSERT INTO ventas (usuario_id, fecha, total, estado, numero_ticket) VALUES (?, NOW(), ?, ?, ?)");
            $stmt->execute([$usuario_id, $total, 'en bodega', $numero_ticket]);
            $venta_id = $db->lastInsertId();

            // 4. Insertar en venta_detalle y actualizar stock
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
        $stmt = $db->prepare("SELECT id, total, fecha, estado, numero_ticket FROM ventas WHERE usuario_id = ? ORDER BY fecha DESC");
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

    public static function actualizarEstadosVentas() {
        require_once __DIR__ . '/../config/db.php';
        $db = (new Database())->getConnection();

        // Cambia a "en camino" si han pasado 5 minutos y sigue "en bodega"
        $sql1 = "UPDATE ventas 
                 SET estado = 'en camino' 
                 WHERE estado = 'en bodega' 
                   AND TIMESTAMPDIFF(MINUTE, fecha, NOW()) >= 5";
        $stmt1 = $db->prepare($sql1);
        $stmt1->execute();

        // Cambia a "entregado" si han pasado 10 minutos y sigue "en camino"
        $sql2 = "UPDATE ventas 
                 SET estado = 'entregado' 
                 WHERE estado = 'en camino' 
                   AND TIMESTAMPDIFF(MINUTE, fecha, NOW()) >= 10";
        $stmt2 = $db->prepare($sql2);
        $stmt2->execute();
    }
}

?>
