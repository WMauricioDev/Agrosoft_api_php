<?php
class Bancal {
    private $connect;
    private $table = "bancal";

    public $id;
    public $fk_lote;
    public $nombre;
    public $tamx;
    public $tamy;
    public $posx;
    public $posy;

    public function __construct($connect) {
        $this->connect = $connect;
    }

    public function getAll() {
        $query = "SELECT * FROM $this->table";
        $stmt = $this->connect->prepare($query);
        if ($stmt->execute()) {
            return $stmt;
        } else {
            die("Error en la consulta: " . implode(", ", $stmt->errorInfo()));
        }
    }

    public function getById($id) {
        $query = "SELECT * FROM $this->table WHERE id = :id LIMIT 1";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            die("Error en la consulta: " . implode(", ", $stmt->errorInfo()));
        }
    }

    public function create() {
        $query = "INSERT INTO $this->table (fk_lote, nombre, tamx, tamy, posx, posy) 
                  VALUES (:fk_lote, :nombre, :tamx, :tamy, :posx, :posy)";
        $stmt = $this->connect->prepare($query);

        $stmt->bindParam(':fk_lote', $this->fk_lote, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':tamx', $this->tamx);
        $stmt->bindParam(':tamy', $this->tamy);
        $stmt->bindParam(':posx', $this->posx);
        $stmt->bindParam(':posy', $this->posy);

        if ($stmt->execute()) {
            return $this->connect->lastInsertId();
        } else {
            die("Error al crear bancal: " . implode(", ", $stmt->errorInfo()));
        }
    }

    public function update() {
        $query = "UPDATE $this->table 
                  SET fk_lote = :fk_lote, nombre = :nombre, tamx = :tamx, tamy = :tamy, posx = :posx, posy = :posy 
                  WHERE id = :id";
        $stmt = $this->connect->prepare($query);
    
        $stmt->bindParam(':fk_lote', $this->fk_lote, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $this->nombre);
        $stmt->bindParam(':tamx', $this->tamx);
        $stmt->bindParam(':tamy', $this->tamy);
        $stmt->bindParam(':posx', $this->posx);
        $stmt->bindParam(':posy', $this->posy);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
    
        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM $this->table WHERE id = :id";
        $stmt = $this->connect->prepare($query);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        
        return $stmt->execute();
    }
}
?>
