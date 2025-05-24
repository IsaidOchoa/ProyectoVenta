<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../services/ProductoService.php';
require_once __DIR__ . '/../config/db.php'; // Asegúrate de tener esto arriba para obtener $db

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
        $ext = strtolower(pathinfo($imagen['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg'])) {
            echo json_encode(["error" => "Solo se permiten imágenes JPG o JPEG"]);
            http_response_code(400);
            return;
        }
        $nombreImagen = uniqid() . '.' . $ext;
        $rutaDestino = __DIR__ . '/../../public/uploads/' . $nombreImagen;

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
            $nombreImagen // SOLO el nombre del archivo, sin 'uploads/'
        )) {
            echo json_encode(["message" => "Producto creado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al crear el producto"]);
            http_response_code(500);
        }
    }

    public static function update($id) {
        $db = (new Database())->getConnection(); // <-- AGREGA ESTA LÍNEA AL INICIO

        // Depuración: muestra qué llega en $_POST y $_FILES
        file_put_contents(__DIR__ . '/debug_update.log', print_r($_POST, true) . "\n" . print_r($_FILES, true));

        // Si es multipart/form-data (FormData), los datos llegan en $_POST y $_FILES
        $nombre = $_POST['nombre'] ?? null;
        $descripcion = $_POST['descripcion'] ?? null;
        $precio = $_POST['precio'] ?? null;
        $stock = $_POST['stock'] ?? null;
        $categoria_id = $_POST['categoria_id'] ?? null;
        $proveedor_id = $_POST['proveedor_id'] ?? null;

        // Verifica que todos los campos requeridos estén presentes (excepto imagen)
        if (!$nombre || !$descripcion || !$precio || !$stock || !$categoria_id || !$proveedor_id) {
            echo json_encode(["error" => "Faltan campos obligatorios"]);
            http_response_code(400);
            return;
        }

        // Manejar la imagen solo si se envía una nueva
        $nombreImagen = null;
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
            $imagen = $_FILES['imagen'];
            $ext = strtolower(pathinfo($imagen['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, ['jpg', 'jpeg'])) {
                echo json_encode(["error" => "Solo se permiten imágenes JPG o JPEG"]);
                http_response_code(400);
                return;
            }
            $nombreImagen = uniqid() . '.' . $ext;
            $rutaDestino = __DIR__ . '/../../public/uploads/' . $nombreImagen;
            if (!move_uploaded_file($imagen['tmp_name'], $rutaDestino)) {
                echo json_encode(["error" => "Error al subir la imagen"]);
                http_response_code(500);
                return;
            }
        }

        // Llama al servicio con todos los parámetros (incluye la imagen solo si hay nueva)
        if (ProductoService::actualizarProducto(
            $db, // <-- agrega esto como primer parámetro
            $id,
            $nombre,
            $descripcion,
            $precio,
            $stock,
            $categoria_id,
            $proveedor_id,
            $nombreImagen // puede ser null si no hay nueva imagen
        )) {
            echo json_encode(["message" => "Producto actualizado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar el producto"]);
            http_response_code(500);
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