<?php
require_once __DIR__ . '/../services/ProductoService.php';
//require_once __DIR__ . '/../config/db.php';

class CategoriasController {
    
    public static function index() {
        //echo "ENTRA CATEGORIAS<br>";
        try {
            $db = (new Database())->getConnection();
            $categorias = ProductoService::obtenerCategorias($db);
            header('Content-Type: application/json');
            echo json_encode($categorias);
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
    // Métodos create, update, delete pueden ir aquí si los necesitas
}
