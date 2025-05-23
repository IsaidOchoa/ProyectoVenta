<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../services/ProveedorService.php';

class ProveedoresController {

    public static function index() {
        try {
            $db = (new Database())->getConnection();
            $proveedores = ProveedorService::obtenerTodos($db);
            echo json_encode(is_array($proveedores) ? $proveedores : []);
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function show($id) {
        try {
            $db = (new Database())->getConnection();
            $proveedor = ProveedorService::obtenerPorId($db, $id);
            if ($proveedor) {
                echo json_encode($proveedor);
            } else {
                header("HTTP/1.1 404 Not Found");
                echo json_encode(["error" => "Proveedor no encontrado"]);
            }
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function store() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['nombre'], $data['direccion'], $data['telefono'])) {
            echo json_encode(["error" => "Faltan datos del proveedor"]);
            http_response_code(400);
            return;
        }
        try {
            $db = (new Database())->getConnection();
            if (ProveedorService::crearProveedor($db, $data['nombre'], $data['direccion'], $data['telefono'])) {
                echo json_encode(["message" => "Proveedor creado exitosamente"]);
            } else {
                echo json_encode(["error" => "Error al crear el proveedor"]);
                http_response_code(500);
            }
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function update($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['nombre'], $data['direccion'], $data['telefono'])) {
            echo json_encode(["error" => "Faltan datos del proveedor"]);
            http_response_code(400);
            return;
        }
        try {
            $db = (new Database())->getConnection();
            if (ProveedorService::actualizarProveedor($db, $id, $data['nombre'], $data['direccion'], $data['telefono'])) {
                echo json_encode(["message" => "Proveedor actualizado exitosamente"]);
            } else {
                echo json_encode(["error" => "Error al actualizar el proveedor"]);
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
            if (ProveedorService::eliminarProveedor($db, $id)) {
                echo json_encode(["message" => "Proveedor eliminado"]);
            } else {
                echo json_encode(["error" => "Error al eliminar el proveedor"]);
                http_response_code(500);
            }
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}
?>