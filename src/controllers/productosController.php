<?php
require_once __DIR__ . '/../services/ProductoService.php';

class ProductosController {

    public static function purchaseFromCart() {
        $cart = json_decode(file_get_contents("php://input"), true);
        foreach ($cart as $item) {
            ProductoService::actualizarStock($item['id'], -$item['quantity']);
        }
        echo json_encode(["message" => "Compra realizada con éxito"]);
    }
    public static function index() {
        try {
            $db = (new Database())->getConnection(); // Obtén la conexión a la base de datos
            $productos = ProductoService::obtenerTodos($db); // Pasa la conexión como argumento
            echo json_encode($productos);
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function show($id) {
        $producto = ProductoService::obtenerPorId($id);
        header('Content-Type: application/json');
        echo json_encode($producto);
    }

    public static function create() {
        $data = json_decode(file_get_contents("php://input"), true);
    
        // Verifica que todos los campos requeridos estén presentes
        if (!isset($data['nombre'], $data['descripcion'], $data['precio'], $data['stock'], $data['categoria_id'], $data['proveedor_id'])) {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            http_response_code(400); // Código de error 400: Bad Request
            return;
        }
    
        // Llama al servicio con todos los parámetros
        if (ProductoService::crearProducto(
            $data['nombre'],
            $data['descripcion'],
            $data['precio'],
            $data['stock'],
            $data['categoria_id'],
            $data['proveedor_id']
        )) {
            echo json_encode(["message" => "Producto creado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al crear el producto"]);
            http_response_code(500); // Código de error 500: Internal Server Error
        }
    }

    public static function update($id) {
        $data = json_decode(file_get_contents("php://input"), true);
    
        // Verifica que todos los campos requeridos estén presentes
        if (!isset($data['nombre'], $data['descripcion'], $data['precio'], $data['stock'], $data['categoria_id'], $data['proveedor_id'])) {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            http_response_code(400); // Código de error 400: Bad Request
            return;
        }
    
        // Llama al servicio con todos los parámetros
        if (ProductoService::actualizarProducto(
            $id,
            $data['nombre'],
            $data['descripcion'],
            $data['precio'],
            $data['stock'],
            $data['categoria_id'],
            $data['proveedor_id']
        )) {
            echo json_encode(["message" => "Producto actualizado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar el producto"]);
            http_response_code(500); // Código de error 500: Internal Server Error
        }
    }

    public static function delete($id) {
        if (ProductoService::eliminarProducto($id)) {
            echo json_encode(["message" => "Producto eliminado"]);
        } else {
            echo json_encode(["message" => "Error al eliminar producto"]);
        }
    }
}
        
?>