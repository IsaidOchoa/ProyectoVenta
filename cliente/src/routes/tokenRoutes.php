<?php
require_once __DIR__ . '/../controllers/tokenController.php';

header('Content-Type: application/json');

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER["REQUEST_METHOD"];

// Procesar solo rutas que comiencen con /api/auth
if (strpos($request_uri, '/api/auth') === 0) {
    // Ruta específica para generar y devolver un token JWT
    if ($request_method === "GET" && $request_uri === '/api/auth/token') {
        tokenController::generarToken();
        exit;
    }

    // Ruta no encontrada dentro de /api/auth
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["error" => "Ruta no encontrada en auth"]);
    exit;
}
?>