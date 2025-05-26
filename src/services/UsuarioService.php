<?php
class UsuarioService {
    public static function crearUsuario($db, $datos) {
        // Validar campos requeridos
        $requeridos = ['nombre', 'apellido', 'correo', 'telefono', 'contrasena', 'pais', 'estado_direccion', 'ciudad', 'calle', 'colonia', 'codigo_postal', 'numero_domicilio'];
        foreach ($requeridos as $campo) {
            if (empty($datos[$campo])) {
                return ['success' => false, 'message' => "Falta el campo: $campo"];
            }
        }

        // Verificar si el correo ya existe
        $stmt = $db->prepare("SELECT id FROM usuarios WHERE correo = ?");
        $stmt->execute([$datos['correo']]);
        if ($stmt->fetch()) {
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

        if ($db->prepare($sql)->execute($params)) {
            return ['success' => true, 'message' => 'Usuario creado correctamente'];
        } else {
            return ['success' => false, 'message' => 'Error al crear usuario'];
        }
    }

    public static function autenticarUsuario($db, $email, $password) {
        // Lógica futura para autenticar usuario
    }
}
?>