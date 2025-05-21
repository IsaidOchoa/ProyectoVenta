<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;

class tokenController {
    public static function generarToken() {
        echo "PRUEBA"; // <-- ¿Ves esto en la respuesta?
        $key = "clave_secreta"; // Cambia esto por tu clave secreta
        $payload = [
            "iss" => "http://localhost",
            "aud" => "http://localhost",
            "iat" => time(),
            "exp" => time() + (60 * 60) // 1 hora de expiración
        ];

        $jwt = JWT::encode($payload, $key, 'HS256');
        echo json_encode(["token" => $jwt]);
    }
}
?>