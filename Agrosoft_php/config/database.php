<?php

class Database {
    private $host = "localhost";
    private $user = "root";
    private $port = "3306";
    private $password = "root";
    private $dbname = "agrosoftphp";
    public $connect;

    public function getConnection() {
        $this->connect = null;

        try {
            $this->connect = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->dbname, $this->user, $this->password);
            $this->connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connect->exec("set names utf8");
        } catch (PDOException $e) {
            echo "Error en la conexión de la base de datos: " . $e->getMessage();
        }

        return $this->connect;
    }
}
?>
