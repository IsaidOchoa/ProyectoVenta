<?php
require_once __DIR__ . '/../config/db.php';

class CategoriaService {
    // Obtener todas las categorías
    public static function obtenerTodas($db) {
        try {
            $query = "SELECT id, nombre_categoria FROM categorias";
            $stmt = $db->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error al obtener las categorías: " . $e->getMessage());
        }
    }

    // Obtener una categoría por ID
    public static function obtenerPorId($db, $id) {
        try {
            $query = "SELECT id, nombre_categoria FROM categorias WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error al obtener la categoría con ID $id: " . $e->getMessage());
        }
    }

    // Crear una nueva categoría
    public static function crearCategoria($db, $nombre_categoria) {
        try {
            $query = "INSERT INTO categorias (nombre_categoria) VALUES (?)";
            $stmt = $db->prepare($query);
            return $stmt->execute([$nombre_categoria]);
        } catch (Exception $e) {
            throw new Exception("Error al crear la categoría: " . $e->getMessage());
        }
    }

    // Actualizar una categoría
    public static function actualizarCategoria($db, $id, $nombre_categoria) {
        try {
            $query = "UPDATE categorias SET nombre_categoria = ? WHERE id = ?";
            $stmt = $db->prepare($query);
            return $stmt->execute([$nombre_categoria, $id]);
        } catch (Exception $e) {
            throw new Exception("Error al actualizar la categoría con ID $id: " . $e->getMessage());
        }
    }

    // Eliminar una categoría
    public static function eliminarCategoria($db, $id) {
        try {
            $query = "DELETE FROM categorias WHERE id = ?";
            $stmt = $db->prepare($query);
            return $stmt->execute([$id]);
        } catch (Exception $e) {
            throw new Exception("Error al eliminar la categoría con ID $id: " . $e->getMessage());
        }
    }
}
?>