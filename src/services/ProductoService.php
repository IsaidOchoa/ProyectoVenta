<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

class ProductoService {
    public static function actualizarStock($db, $id, $cantidad) {
    
        try {
            $query = "UPDATE productos SET stock = stock + ? WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$cantidad, $id]);
        } catch (Exception $e) {
            throw new Exception("Error al actualizar el stock del producto con ID $id: " . $e->getMessage());
        }
    }

    public static function obtenerTodos($db) { //para administrador
        try {
            $query = "SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, 
                         p.imagen, p.estado,  -- <--- agrega esto
                         c.nombre_categoria AS categoria_nombre, 
                         pr.nombre AS proveedor_nombre
                  FROM productos p
                  JOIN categorias c ON p.categoria_id = c.id
                  JOIN proveedores pr ON p.proveedor_id = pr.id";
            $stmt = $db->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error al obtener los productos: " . $e->getMessage());
        }
    }

    public static function obtenerPorId($db,$id) {
        
    
        try {
            $query = "SELECT * FROM productos WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error al obtener el producto con ID $id: " . $e->getMessage());
        }
    }

    public static function crearProducto($nombre, $descripcion, $precio, $stock, $categoria_id, $proveedor_id, $rutaImagen) {
        $db = (new Database())->getConnection();
        $query = "INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, proveedor_id, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        return $stmt->execute([$nombre, $descripcion, $precio, $stock, $categoria_id, $proveedor_id, $rutaImagen]);
    }

    public static function actualizarProducto($db, $id, $nombre, $descripcion, $precio, $stock, $categoria_id, $proveedor_id, $nombreImagen = null) {
        if ($nombreImagen) {
            // Si hay nueva imagen, actualiza también la columna imagen
            $query = "UPDATE productos 
                      SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ?, proveedor_id = ?, imagen = ?
                      WHERE id = ?";
            $params = [$nombre, $descripcion, $precio, $stock, $categoria_id, $proveedor_id, $nombreImagen, $id];
        } else {
            // Si no hay nueva imagen, no la actualices
            $query = "UPDATE productos 
                      SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ?, proveedor_id = ?
                      WHERE id = ?";
            $params = [$nombre, $descripcion, $precio, $stock, $categoria_id, $proveedor_id, $id];
        }
        $stmt = $db->prepare($query);
        return $stmt->execute($params);
    }

    public static function eliminarProducto($db,$id) {
        
        $query = "DELETE FROM productos WHERE id = ?";
        $stmt = $db->prepare($query);
        return $stmt->execute([$id]);
    }
    public static function obtenerCategorias($db) {
        try {
            $query = "SELECT id, nombre_categoria FROM categorias";
            $stmt = $db->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error al obtener las categorías: " . $e->getMessage());
        }
    }
    
    public static function obtenerProveedores($db) {
        try {
            $query = "SELECT id, nombre FROM proveedores";
            $stmt = $db->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error al obtener los proveedores: " . $e->getMessage());
        }
    }

    public static function obtenerActivos($db) { //para cliente
        try {
            $query = "SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, 
                         p.imagen, p.estado,
                         c.nombre_categoria AS categoria_nombre, 
                         pr.nombre AS proveedor_nombre
                  FROM productos p
                  JOIN categorias c ON p.categoria_id = c.id
                  JOIN proveedores pr ON p.proveedor_id = pr.id
                  WHERE p.estado = 1";
            $stmt = $db->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error al obtener los productos activos: " . $e->getMessage());
        }
    }

    public static function desactivarProducto($db, $id) {
        try {
            $query = "UPDATE productos SET estado = 0 WHERE id = ?";
            $stmt = $db->prepare($query);
            return $stmt->execute([$id]);
        } catch (Exception $e) {
            throw new Exception("Error al desactivar el producto con ID $id: " . $e->getMessage());
        }
    }

    public static function activarProducto($db, $id) {
        try {
            $query = "UPDATE productos SET estado = 1 WHERE id = ?";
            $stmt = $db->prepare($query);
            return $stmt->execute([$id]);
        } catch (Exception $e) {
            throw new Exception("Error al activar el producto con ID $id: " . $e->getMessage());
        }
    }
}
?>