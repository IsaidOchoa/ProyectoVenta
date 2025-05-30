<?php
class CarritoService {
    public static function obtenerCarrito($db, $usuario_id) {
        $stmt = $db->prepare("
            SELECT 
                c.producto_id, 
                c.cantidad, 
                p.nombre, 
                p.precio, 
                p.imagen 
            FROM carrito c
            JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = ?
        ");
        $stmt->execute([$usuario_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function agregarActualizar($db, $usuario_id, $producto_id, $cantidad) {
        // Busca si ya existe el producto en el carrito
        $stmt = $db->prepare("SELECT cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?");
        $stmt->execute([$usuario_id, $producto_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            // Suma la cantidad recibida a la actual
            $nuevaCantidad = $row['cantidad'] + $cantidad;
            $stmt = $db->prepare("UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?");
            $stmt->execute([$nuevaCantidad, $usuario_id, $producto_id]);
        } else {
            $stmt = $db->prepare("INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)");
            $stmt->execute([$usuario_id, $producto_id, $cantidad]);
        }
    }

    public static function eliminarProducto($db, $usuario_id, $producto_id) {
        $stmt = $db->prepare("DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?");
        $stmt->execute([$usuario_id, $producto_id]);
    }

    public static function vaciarCarrito($db, $usuario_id) {
        $stmt = $db->prepare("DELETE FROM carrito WHERE usuario_id = ?");
        $stmt->execute([$usuario_id]);
    }
}