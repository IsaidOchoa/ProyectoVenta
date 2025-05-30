<?php
require_once __DIR__ . '/../services/ProductoService.php';
require_once __DIR__ . '/../services/ClienteService.php';
require_once __DIR__ . '/../config/db.php';

class ComprasController {
    
public static function realizarCompra() {
    $db = (new Database())->getConnection();
    $cart = json_decode(file_get_contents("php://input"), true);

    if (empty($cart) || !isset($cart['productos']) || !isset($cart['usuario_id'])) {
        echo json_encode(["error" => "Datos incompletos para realizar la compra"]);
        http_response_code(400);
        return;
    }

    $productos = $cart['productos'];
    $usuario_id = $cart['usuario_id']; // ID del usuario que realiza la compra
    $total = 0;

    try {
        // Verificar el stock antes de iniciar la transacción
        foreach ($productos as $item) {
            $producto = ProductoService::obtenerPorId($db, $item['id']);
            if (!$producto || $producto['stock'] < $item['cantidad']) {
                echo json_encode(["error" => "Stock insuficiente para el producto con ID " . $item['id']]);
                http_response_code(400);
                return;
            }
            $total += $producto['precio'] * $item['cantidad'];
        }

        $db->beginTransaction();

        // Registrar la venta en la tabla `ventas`
        $queryVenta = "INSERT INTO ventas (usuario_id, fecha, total, status) VALUES (?, NOW(), ?, 'en bodega')";
        $stmtVenta = $db->prepare($queryVenta);
        $stmtVenta->execute([$usuario_id, $total]);
        $id_venta = $db->lastInsertId();

        // Registrar los detalles de la venta
        $queryDetalle = "INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)";
        $stmtDetalle = $db->prepare($queryDetalle);

        foreach ($productos as $item) {
            $stmtDetalle->execute([
                $id_venta,
                $item['id'],
                $item['cantidad'],
                $item['precio_unitario']
            ]);

            // Actualizar el stock de los productos
            ProductoService::actualizarStock($db, $item['id'], -$item['cantidad']);
        }

        // Limpiar el carrito del usuario después de la compra
        $stmt = $db->prepare("DELETE FROM carrito WHERE usuario_id = ?");
        $stmt->execute([$usuario_id]);

        $db->commit();
        echo json_encode([
            "success" => true,
            "message" => "Compra realizada con éxito",
            "id_venta" => $id_venta
        ]);
        exit;
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage(),
            "line" => $e->getLine(),
            "file" => $e->getFile()
        ]);
        exit;
    }
}
    public static function obtenerProductos() {
        try {
            $db = (new Database())->getConnection();
            $query = "SELECT id, nombre, descripcion, CAST(precio AS DECIMAL(10,2)) AS precio, stock FROM productos";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            if (empty($productos)) {
                echo json_encode([]); // Devuelve un array vacío si no hay productos
                return;
            }
    
            echo json_encode($productos);
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
    public static function agregarProductoCarrito() {
        try {
            $db = (new Database())->getConnection();
            $data = json_decode(file_get_contents("php://input"), true);
    
            if (empty($data) || !isset($data['producto_id']) || !isset($data['cantidad'])) {
                echo json_encode(["error" => "Datos incompletos para agregar al carrito"]);
                http_response_code(400);
                return;
            }
    
            $query = "INSERT INTO carrito (producto_id, cantidad) VALUES (?, ?)";
            $stmt = $db->prepare($query);
            $stmt->execute([$data['producto_id'], $data['cantidad']]);
    
            echo json_encode(["message" => "Producto agregado al carrito"]);
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
    
public static function vaciarCarrito() {
    try {
        $db = (new Database())->getConnection();
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['usuario_id'])) {
            echo json_encode(["error" => "Usuario no especificado"]);
            http_response_code(400);
            return;
        }

        $query = "DELETE FROM carrito WHERE usuario_id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$data['usuario_id']]);

        echo json_encode(["message" => "Carrito vaciado"]);
    } catch (Exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(["error" => $e->getMessage()]);
    }
}
    
public static function eliminarProductoCarrito($id) {
    try {
        $db = (new Database())->getConnection();
        $query = "DELETE FROM carrito WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$id]);

        echo json_encode(["message" => "Producto eliminado del carrito"]);
    } catch (Exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(["error" => $e->getMessage()]);
    }
}


}
?>