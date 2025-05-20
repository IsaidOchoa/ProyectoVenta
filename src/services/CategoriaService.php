<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($input['_method'])) {
    if ($input['_method'] === 'PUT') {
        // Actualizar
        if (!isset($input['id']) || !isset($input['nombre_categoria'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
            exit;
        }
        try {
            $db = (new Database())->getConnection();
            $query = "UPDATE categorias SET nombre_categoria = ? WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$input['nombre_categoria'], $input['id']]);
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
            $query = "DELETE FROM categorias WHERE id = ?";
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
    if (!isset($input['nombre_categoria'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Falta el nombre de la categoría']);
        exit;
    }
    try {
        $db = (new Database())->getConnection();
        $query = "INSERT INTO categorias (nombre_categoria) VALUES (?)";
        $stmt = $db->prepare($query);
        $stmt->execute([$input['nombre_categoria']]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

try {
    $db = (new Database())->getConnection();
    $query = "SELECT id, nombre_categoria FROM categorias";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categorias);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}