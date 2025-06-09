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
            CompraService::realizarCompra($db, $cart['productos']);

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

    // Otros métodos...
}
?>
