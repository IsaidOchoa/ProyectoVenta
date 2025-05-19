<?php
class Database {
    private $host = "localhost"; // Cambia esto si tu base de datos está en otro servidor
    private $db_name = "walmart"; // Nombre de tu base de datos
    private $username = "root"; // Usuario de MySQL
    private $password = "1234567890"; // Contraseña de MySQL
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>