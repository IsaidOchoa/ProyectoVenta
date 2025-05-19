<?php
require_once __DIR__ . '/../config/db.php';

class ClienteService {
    public static function obtenerORegistrarCliente($cliente) {
        $db = (new Database())->getConnection();

        // Verificar si el cliente ya existe
        $query = "SELECT id FROM usuarios WHERE correo = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$cliente['correo']]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($resultado) {
            // Si el cliente ya existe, devolver su ID
            return $resultado['id'];
        } else {
            // Registrar un nuevo cliente
            $queryInsert = "INSERT INTO usuarios (id, nombre, apellido, correo, telefono, pais, estado, ciudad, calle, colonia, codigo_postal, numero_domicilio) 
                            VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtInsert = $db->prepare($queryInsert);
            $stmtInsert->execute([
                $cliente['nombre'],
                $cliente['apellido'],
                $cliente['correo'],
                $cliente['telefono'],
                $cliente['pais'],
                $cliente['estado'],
                $cliente['ciudad'],
                $cliente['calle'],
                $cliente['colonia'],
                $cliente['codigo_postal'],
                $cliente['numero_domicilio']
            ]);

            return $db->lastInsertId(); // Devolver el ID del cliente recién creado
        }
    }
}
?>