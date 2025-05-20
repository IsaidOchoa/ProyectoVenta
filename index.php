<?php
// Configuración de errores
//ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Forzar log de errores a un archivo específico
//ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');

// Verificar si el archivo de rutas existe
if (!file_exists(__DIR__ . '/src/routes/productosRoutes.php')) {
    die('Error: El archivo productosRoutes.php no se encuentra en la ruta especificada.');
}

// Incluir archivo de rutas
require_once __DIR__ . '/src/routes/productosRoutes.php';
require_once __DIR__ . '/src/routes/comprasRoutes.php';
require_once __DIR__ . '/src/routes/tokenRoutes.php';
require_once __DIR__ . '/src/routes/ProveedoresRoutes.php';
require_once __DIR__ . '/src/routes/usuariosRoutes.php';
require_once __DIR__ . '/src/routes/CategoriasRoutes.php';

// Incluir autoload de Composer
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    die('Error: El autoload de Composer no se encontró. Ejecuta "composer install".');
}
require_once __DIR__ . '/vendor/autoload.php';

// No generar ni mostrar el token JWT aquí

//echo "INICIO INDEX<br>";
?>