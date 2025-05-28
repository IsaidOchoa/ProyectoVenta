<?php
// Configuración de errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Forzar log de errores a un archivo específico
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');

// Configuración de encabezados para CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verificar si el archivo de rutas existe
if (!file_exists(__DIR__ . '/../src/routes/productosRoutes.php')) {
    die('Error: El archivo productosRoutes.php no se encuentra en la ruta especificada.');
}

// Incluir archivo de rutas
require_once __DIR__ . '/../src/routes/usuariosRoutes.php';
require_once __DIR__ . '/../src/routes/comprasRoutes.php';
require_once __DIR__ . '/../src/routes/ProveedoresRoutes.php';
require_once __DIR__ . '/../src/routes/productosRoutes.php';
require_once __DIR__ . '/../src/routes/CategoriasRoutes.php';

require_once __DIR__ . '/../src/routes/tokenRoutes.php';

// Incluir autoload de Composer
if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
    die('Error: El autoload de Composer no se encontró. Ejecuta "composer install".');
}
require_once __DIR__ . '/../vendor/autoload.php';

?>