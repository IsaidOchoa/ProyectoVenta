<?php
class LoggingMiddleware {
    public static function registrarSolicitud() {
        $archivo_log = "../logs/accesos.log";
        $mensaje = date("Y-m-d H:i:s") . " - " . $_SERVER['REQUEST_URI'] . " - " . $_SERVER['REMOTE_ADDR'] . PHP_EOL;
        file_put_contents($archivo_log, $mensaje, FILE_APPEND);
    }
}
?>