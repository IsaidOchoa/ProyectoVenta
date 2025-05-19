<?php
require_once __DIR__ . '/../services/UsuarioService.php';
require_once __DIR__ . '/../config/db.php';

class UsuariosController {
    public static function register() {
        // Aquí irá la lógica de registro
        echo json_encode(["message" => "Registro no implementado aún"]);
    }

    public static function login() {
        // Aquí irá la lógica de login
        echo json_encode(["message" => "Login no implementado aún"]);
    }
}
?>