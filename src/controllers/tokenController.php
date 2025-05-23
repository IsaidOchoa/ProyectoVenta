<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;

class tokenController {
    public static function generarToken() {
        $key = "clave_secreta"; // Usa la misma clave
        $payload = [
            "iat" => time(),
            "exp" => time() + 3600,
            "data" => [
                "user_id" => 1, // Puedes poner aquí los datos del usuario autenticado
                "rol" => "admin"
            ]
        ];

        $jwt = JWT::encode($payload, $key, 'HS256');
        echo json_encode(["token" => $jwt]);
    }
}
?>