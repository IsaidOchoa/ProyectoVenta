<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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
            $db = (new Database())->getConnection();
            $productos = ProductoService::obtenerTodos($db);
            // Siempre responde un array, aunque esté vacío
            echo json_encode(is_array($productos) ? $productos : []);
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
        // Verifica que todos los campos requeridos estén presentes
        if (
            !isset($_POST['nombre'], $_POST['descripcion'], $_POST['precio'], $_POST['stock'], $_POST['categoria'], $_POST['proveedor'])
            || !isset($_FILES['imagen'])
        ) {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            http_response_code(400);
            return;
        }

        // Manejar la imagen
        $imagen = $_FILES['imagen'];
        $nombreImagen = uniqid() . '.jpg';
        $rutaDestino = __DIR__ . '/../../uploads/' . $nombreImagen;

        if (!move_uploaded_file($imagen['tmp_name'], $rutaDestino)) {
            echo json_encode(["error" => "Error al subir la imagen"]);
            http_response_code(500);
            return;
        }

        // Llama al servicio con todos los parámetros
        if (ProductoService::crearProducto(
            $_POST['nombre'],
            $_POST['descripcion'],
            $_POST['precio'],
            $_POST['stock'],
            $_POST['categoria'],
            $_POST['proveedor'],
            'uploads/' . $nombreImagen // ruta relativa para guardar en la BD
        )) {
            echo json_encode(["message" => "Producto creado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al crear el producto"]);
            http_response_code(500);
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