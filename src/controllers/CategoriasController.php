<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../services/CategoriaService.php';

class CategoriasController {

    public static function index() {
        try {
            $db = (new Database())->getConnection();
            $categorias = CategoriaService::obtenerTodas($db);
            echo json_encode(is_array($categorias) ? $categorias : []);
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function show($id) {
        try {
            $db = (new Database())->getConnection();
            $categoria = CategoriaService::obtenerPorId($db, $id);
            if ($categoria) {
                echo json_encode($categoria);
            } else {
                header("HTTP/1.1 404 Not Found");
                echo json_encode(["error" => "Categoría no encontrada"]);
            }
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function store() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['nombre_categoria'])) {
            echo json_encode(["error" => "Falta el nombre de la categoría"]);
            http_response_code(400);
            return;
        }
        try {
            $db = (new Database())->getConnection();
            if (CategoriaService::crearCategoria($db, $data['nombre_categoria'])) {
                echo json_encode(["message" => "Categoría creada exitosamente"]);
            } else {
                echo json_encode(["error" => "Error al crear la categoría"]);
                http_response_code(500);
            }
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function update($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['nombre_categoria'])) {
            echo json_encode(["error" => "Falta el nombre de la categoría"]);
            http_response_code(400);
            return;
        }
        try {
            $db = (new Database())->getConnection();
            if (CategoriaService::actualizarCategoria($db, $id, $data['nombre_categoria'])) {
                echo json_encode(["message" => "Categoría actualizada exitosamente"]);
            } else {
                echo json_encode(["error" => "Error al actualizar la categoría"]);
                http_response_code(500);
            }
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function destroy($id) {
        try {
            $db = (new Database())->getConnection();
            if (CategoriaService::eliminarCategoria($db, $id)) {
                echo json_encode(["message" => "Categoría eliminada"]);
            } else {
                echo json_encode(["error" => "Error al eliminar la categoría"]);
                http_response_code(500);
            }
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}
?>
