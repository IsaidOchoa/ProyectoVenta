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

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($input['_method'])) {
    if ($input['_method'] === 'PUT') {
        // Actualizar
        if (!isset($input['id']) || !isset($input['nombre'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
            exit;
        }
        try {
            $db = (new Database())->getConnection();
            $query = "UPDATE proveedores SET nombre = ? WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$input['nombre'], $input['id']]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }
    if ($input['_method'] === 'DELETE') {
        // Eliminar
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Falta el id']);
            exit;
        }
        try {
            $db = (new Database())->getConnection();
            $query = "DELETE FROM proveedores WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$input['id']]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($input['nombre'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Falta el nombre del proveedor']);
        exit;
    }
    try {
        $db = (new Database())->getConnection();
        $query = "INSERT INTO proveedores (nombre) VALUES (?)";
        $stmt = $db->prepare($query);
        $stmt->execute([$input['nombre']]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

try {
    $db = (new Database())->getConnection();
    $query = "SELECT id, nombre FROM proveedores";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($proveedores);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}