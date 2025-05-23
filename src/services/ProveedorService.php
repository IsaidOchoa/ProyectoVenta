<?php
require_once __DIR__ . '/../config/db.php';

class ProveedorService {
    public static function obtenerTodos($db) {
        try {
            $query = "SELECT id, nombre, direccion, telefono FROM proveedores";
            $stmt = $db->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error al obtener los proveedores: " . $e->getMessage());
        }
    }

    public static function obtenerPorId($db, $id) {
        try {
            $query = "SELECT id, nombre, direccion, telefono FROM proveedores WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Error al obtener el proveedor con ID $id: " . $e->getMessage());
        }
    }

    public static function crearProveedor($db, $nombre, $direccion, $telefono) {
        try {
            $query = "INSERT INTO proveedores (nombre, direccion, telefono) VALUES (?, ?, ?)";
            $stmt = $db->prepare($query);
            return $stmt->execute([$nombre, $direccion, $telefono]);
        } catch (Exception $e) {
            throw new Exception("Error al crear el proveedor: " . $e->getMessage());
        }
    }

    public static function actualizarProveedor($db, $id, $nombre, $direccion, $telefono) {
        try {
            $query = "UPDATE proveedores SET nombre = ?, direccion = ?, telefono = ? WHERE id = ?";
            $stmt = $db->prepare($query);
            return $stmt->execute([$nombre, $direccion, $telefono, $id]);
        } catch (Exception $e) {
            throw new Exception("Error al actualizar el proveedor con ID $id: " . $e->getMessage());
        }
    }

    public static function eliminarProveedor($db, $id) {
        try {
            $query = "DELETE FROM proveedores WHERE id = ?";
            $stmt = $db->prepare($query);
            return $stmt->execute([$id]);
        } catch (Exception $e) {
            throw new Exception("Error al eliminar el proveedor con ID $id: " . $e->getMessage());
        }
    }
}
?>