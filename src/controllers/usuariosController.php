<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../services/UsuarioService.php';
require_once __DIR__ . '/../config/db.php';

class UsuariosController {
    public static function register() {
        file_put_contents(__DIR__ . '/debug_registro.log', "INICIO register\n", FILE_APPEND);

        $input = json_decode(file_get_contents('php://input'), true);
        file_put_contents(__DIR__ . '/debug_registro.log', "INPUT RECIBIDO: " . print_r($input, true), FILE_APPEND);

        if (!$input) {
            file_put_contents(__DIR__ . '/debug_registro.log', "NO INPUT\n", FILE_APPEND);
            http_response_code(400);
            $json = json_encode(['success' => false, 'message' => 'Datos inválidos']);
            file_put_contents(__DIR__ . '/debug_registro.log', "JSON ERROR: " . $json . "\n", FILE_APPEND);
            echo $json;
            exit;
        }

        $db = (new Database())->getConnection();
        file_put_contents(__DIR__ . '/debug_registro.log', "DB OK\n", FILE_APPEND);

        $resultado = UsuarioService::crearUsuario($db, $input);
        file_put_contents(__DIR__ . '/debug_registro.log', "RESULTADO crearUsuario: " . print_r($resultado, true), FILE_APPEND);

        if ($resultado && isset($resultado['success'])) {
            if ($resultado['success']) {
                http_response_code(201);
                $json = json_encode([
                    "success" => true,
                    "message" => "Usuario registrado correctamente"
                ]);
                file_put_contents(__DIR__ . '/debug_registro.log', "JSON OK: " . $json . "\n", FILE_APPEND);
                echo $json;
                exit;
            } else {
                http_response_code(400);
                $json = json_encode([
                    "success" => false,
                    "message" => $resultado['message'] ?? 'Error al registrar usuario'
                ]);
                file_put_contents(__DIR__ . '/debug_registro.log', "JSON FAIL: " . $json . "\n", FILE_APPEND);
                echo $json;
                exit;
            }
        } else {
            http_response_code(500);
            $json = json_encode([
                "success" => false,
                "message" => "Error interno en el registro"
            ]);
            file_put_contents(__DIR__ . '/debug_registro.log', "JSON INTERNAL: " . $json . "\n", FILE_APPEND);
            echo $json;
            exit;
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
        $db = (new Database())->getConnection();

        // Autenticar usuario
        $resultado = UsuarioService::login($db, $input['correo'], $input['contrasena']);

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

    public static function getAll() {
        $db = (new Database())->getConnection();
        $stmt = $db->query("SELECT id, nombre, correo, rol, fecha_registro FROM usuarios");
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($usuarios);
        exit;
    }

    public static function toggleEstado($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['estado_usuario'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Falta el campo estado_usuario']);
            exit;
        }
        $db = (new Database())->getConnection();
        $stmt = $db->prepare("UPDATE usuarios SET estado_usuario = ? WHERE id = ?");
        $ok = $stmt->execute([$input['estado_usuario'], $id]);
        if ($ok) {
            echo json_encode(['success' => true, 'message' => 'Estado actualizado']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al actualizar estado']);
        }
        exit;
    }
}
?>