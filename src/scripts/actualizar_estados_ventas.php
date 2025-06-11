<?php
require_once __DIR__ . '/../config/db.php';

// Conexión a la base de datos
$conn = (new Database())->getConnection();

// Cambia a "en camino" si han pasado 5 minutos y sigue "en bodega"
$sql1 = "UPDATE ventas 
         SET estado = 'en camino' 
         WHERE estado = 'en bodega' 
           AND TIMESTAMPDIFF(MINUTE, fecha, NOW()) >= 5";
mysqli_query($conn, $sql1);

// Cambia a "entregado" si han pasado 10 minutos y sigue "en camino"
$sql2 = "UPDATE ventas 
         SET estado = 'entregado' 
         WHERE estado = 'en camino' 
           AND TIMESTAMPDIFF(MINUTE, fecha, NOW()) >= 10";
mysqli_query($conn, $sql2);

echo "Estados de ventas actualizados correctamente.\n";