<?php
require_once __DIR__ . '/../services/UsuarioService.php';
require_once __DIR__ . '/../config/db.php';

class UsuariosController {
    public static function register() {
        header('Content-Type: application/json');

        // Obtener datos del body (JSON)
        $input = json_decode(file_get_contents('php://input'), true);

        // Validar que se recibieron datos
        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
            return;
        }

        // Conexión a la base de datos
        $db = getDB();

        // Crear usuario
        $resultado = UsuarioService::crearUsuario($db, $input);

        if ($resultado['success']) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Usuario registrado correctamente"
            ]);
            exit;
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $resultado['message']]);
        }
    }

    public static function login() {
        header('Content-Type: application/json');

        // Obtener datos del body (JSON)
        $input = json_decode(file_get_contents('php://input'), true);

        // Validar campos requeridos
        if (empty($input['correo']) || empty($input['contrasena'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Correo y contraseña son obligatorios']);
            return;
        }

        // Conexión a la base de datos
        $db = getDB();

        // Autenticar usuario
        $resultado = UsuarioService::autenticarUsuario($db, $input['correo'], $input['contrasena']);

        if ($resultado['success']) {
            // Generar token JWT
            require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
            $token = AuthMiddleware::generarToken([
                'id' => $resultado['usuario']['id'],
                'correo' => $resultado['usuario']['correo'],
                'rol' => $resultado['usuario']['rol']
            ]);
            echo json_encode([
                'success' => true,
                'usuario' => $resultado['usuario'],
                'token' => $token
            ]);
        } else {
            http_response_code(401);
            echo json_encode($resultado);
        }
    }
}
?>