<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware {
    private static $secretKey = "clave_secreta"; // Cambia esto por tu clave secreta

    public static function generarToken($data) {
        $playload = [
            'iat' => time(),
            'exp' => time() + 3600,
            'data' => $data
        ];
        $token = JWT::encode($playload, self::$secretKey, 'HS256');
        return $token;
    }

    public static function verificarToken() {
        $headers = apache_request_headers();
        if (!isset($headers['Authorization'])) {
            header("HTTP/1.1 401 Unauthorized");
            echo json_encode(["error" => "Token no proporcionado"]);
            exit;
        }
        $authHeader = $headers['Authorization'];
        $token = str_replace('Bearer ', '', $authHeader);
        try {
            $decoded = JWT::decode($token, new Key(self::$secretKey, 'HS256'));
        } catch (Exception $e) {
            header("HTTP/1.1 403 Forbidden");
            echo json_encode(["error" => "Token inválido"]);
            exit;
        }
    }
}
?>