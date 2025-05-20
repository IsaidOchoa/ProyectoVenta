<?php
require_once __DIR__ . '/../config/db.php';
//$db = (new Database())->getConnection();
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

    public static function obtenerTodos($db) {
        try {
            $query = "SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, 
                             p.imagen,  -- <--- agrega esto
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

    public static function crearProducto($db,$nombre, $descripcion, $precio, $stock, $categoria_id, $proveedor_id) {
        
        $query = "INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, proveedor_id) 
                  VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        return $stmt->execute([$nombre, $descripcion, $precio, $stock, $categoria_id, $proveedor_id]);
    }

    public static function actualizarProducto($db,$id, $nombre, $descripcion, $precio, $stock, $categoria_id, $proveedor_id) {
        
        $query = "UPDATE productos 
                  SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ?, proveedor_id = ? 
                  WHERE id = ?";
        $stmt = $db->prepare($query);
        return $stmt->execute([$nombre, $descripcion, $precio, $stock, $categoria_id, $proveedor_id, $id]);
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
}
?>