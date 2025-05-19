<?php
header("Access-Control-Allow-Origin: *");
require_once __DIR__ . '/../controllers/comprasController.php';

header('Content-Type: application/json');

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER["REQUEST_METHOD"];

// Procesar solo rutas que comiencen con /api/compras
if (strpos($request_uri, '/api/compras') === 0) {
    // Ruta específica para realizar una compra
    if ($request_method === "POST" && $request_uri === '/api/compras/realizar') {
        $data = json_decode(file_get_contents("php://input"), true);
        $carrito = $data['carrito'] ?? [];
        $db = (new Database())->getConnection();

        foreach ($carrito as $item) {
            // Verifica stock actual
            $stmt = $db->prepare("SELECT stock FROM productos WHERE id = ?");
            $stmt->execute([$item['id']]);
            $stockActual = $stmt->fetchColumn();

            if ($stockActual < $item['cantidad']) {
                echo json_encode([
                    "success" => false,
                    "message" => "No hay suficiente stock para el producto: " . $item['nombre']
                ]);
                exit;
            }

            // Resta el stock
            $stmt = $db->prepare("UPDATE productos SET stock = stock - ? WHERE id = ?");
            $stmt->execute([$item['cantidad'], $item['id']]);
        }

        echo json_encode(["success" => true]);
        exit;
    }
    // Ruta para agregar un producto al carrito
    if ($request_method === "POST" && $request_uri === '/api/compras/carrito/agregar') {
        ComprasController::agregarProductoCarrito();
        exit;
    }
    // Ruta para obtener los productos del carrito

    if ($request_method === "GET" && $request_uri === '/api/compras/productos') {
        ComprasController::obtenerProductos();
        exit;
    }

    // Ruta para eliminar un producto del carrito
    if ($request_method === "DELETE" && preg_match('/\/api\/compras\/carrito\/eliminar\/(\d+)/', $request_uri, $matches)) {
        $id = filter_var($matches[1], FILTER_VALIDATE_INT);
        if (!$id) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "ID inválido"]);
            exit;
        }
        ComprasController::eliminarProductoCarrito($id);
        exit;
    }
    // Ruta para vaciar el carrito
    if ($request_method === "DELETE" && $request_uri === '/api/compras/carrito/vaciar') {
        ComprasController::vaciarCarrito();
        exit;
    }

    // Ruta no encontrada dentro de /api/compras
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["error" => "Ruta no encontrada en compras"]);
    exit;
}
?>