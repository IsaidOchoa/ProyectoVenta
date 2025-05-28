<?php
require_once __DIR__ . '/../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

class UsuarioService {
    public static function crearUsuario($db, $datos) {
        file_put_contents(__DIR__ . '/debug_registro.log', "INICIO crearUsuario: " . print_r($datos, true), FILE_APPEND);

        // Validar campos requeridos
        $requeridos = ['nombre', 'apellido', 'correo', 'telefono', 'contrasena', 'pais', 'estado_direccion', 'ciudad', 'calle', 'colonia', 'codigo_postal', 'numero_domicilio'];
        foreach ($requeridos as $campo) {
            if (empty($datos[$campo])) {
                file_put_contents(__DIR__ . '/debug_registro.log', "FALTA CAMPO: $campo\n", FILE_APPEND);
                return ['success' => false, 'message' => "Falta el campo: $campo"];
            }
        }

        // Verificar si el correo ya existe
        $stmt = $db->prepare("SELECT id FROM usuarios WHERE correo = ?");
        $stmt->execute([$datos['correo']]);
        if ($stmt->fetch()) {
            file_put_contents(__DIR__ . '/debug_registro.log', "CORREO YA REGISTRADO\n", FILE_APPEND);
            return ['success' => false, 'message' => 'El correo ya está registrado'];
        }

        // Generar ID único (puedes usar UUID o similar)
        $id = uniqid('usr_', true);
        // Encriptar contraseña
        $hash = password_hash($datos['contrasena'], PASSWORD_DEFAULT);
        // Insertar usuario
        $sql = "INSERT INTO usuarios 
            (id, nombre, apellido, correo, telefono, contrasena, pais, estado_direccion, ciudad, calle, colonia, codigo_postal, numero_domicilio, rol, estado_usuario, fecha_registro)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cliente', 1, NOW())";
        $params = [
            $id,
            $datos['nombre'],
            $datos['apellido'],
            $datos['correo'],
            $datos['telefono'],
            $hash,
            $datos['pais'],
            $datos['estado_direccion'],
            $datos['ciudad'],
            $datos['calle'],
            $datos['colonia'],
            $datos['codigo_postal'],
            $datos['numero_domicilio']
        ];

        $result = $db->prepare($sql)->execute($params);
        file_put_contents(__DIR__ . '/debug_registro.log', "EJECUTA INSERT: " . ($result ? "OK" : "FALLÓ") . "\n", FILE_APPEND);

        if ($result) {
            return ['success' => true, 'message' => 'Usuario creado correctamente'];
        } else {
            return ['success' => false, 'message' => 'Error al registrar usuario'];
        }
    }

    public static function login($db, $correo, $contrasena) {
        // Validar campos requeridos
        if (empty($correo) || empty($contrasena)) {
            return ['success' => false, 'message' => 'Correo y contraseña son obligatorios'];
        }

        // Buscar usuario por correo
        $stmt = $db->prepare("SELECT * FROM usuarios WHERE correo = ?");
        $stmt->execute([$correo]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$usuario) {
            return ['success' => false, 'message' => 'Usuario o contraseña incorrectos'];
        }

        // Verificar si el usuario está activo
        if (isset($usuario['estado_usuario']) && $usuario['estado_usuario'] != 1) {
            return ['success' => false, 'message' => 'Usuario NO disponible'];
        }

        // Verificar contraseña
        if (!password_verify($contrasena, $usuario['contrasena'])) {
            return ['success' => false, 'message' => 'Usuario o contraseña incorrectos'];
        }

        // No devolver la contraseña
        unset($usuario['contrasena']);

        return ['success' => true, 'usuario' => $usuario];
    }
}
?>