<?php
require_once __DIR__ . '/../config/db.php';

// Conexión a la base de datos (PDO)
$db = (new Database())->getConnection();

// Cambia a "en camino" si han pasado 5 minutos y sigue "en bodega"
$sql1 = "UPDATE ventas 
         SET estado = 'en camino' 
         WHERE estado = 'en bodega' 
           AND TIMESTAMPDIFF(MINUTE, fecha, NOW()) >= 5";
$stmt1 = $db->prepare($sql1);
$stmt1->execute();

// Cambia a "entregado" si han pasado 10 minutos y sigue "en camino"
$sql2 = "UPDATE ventas 
         SET estado = 'entregado' 
         WHERE estado = 'en camino' 
           AND TIMESTAMPDIFF(MINUTE, fecha, NOW()) >= 10";
$stmt2 = $db->prepare($sql2);
$stmt2->execute();

echo "Estados de ventas actualizados correctamente.\n";