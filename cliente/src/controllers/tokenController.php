<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;

class tokenController {
    public static function generarToken() {
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