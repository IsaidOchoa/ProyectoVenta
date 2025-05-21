<?php
require_once __DIR__ . '/../controllers/tokenController.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER["REQUEST_METHOD"];

if ($request_method === "GET" && strpos($request_uri, '/api/auth/token') !== false) {
    tokenController::generarToken();
    exit;
}

// Si llega aquí, ruta no encontrada
header("HTTP/1.1 404 Not Found");
echo json_encode(["error" => "Ruta no encontrada en auth"]);
exit;