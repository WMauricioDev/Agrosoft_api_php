<?php
spl_autoload_register(function ($class) {
    $directorios = [
        __DIR__ . '/controllers/Cultivo/',
        __DIR__ . '/controllers/Inventario/',
        __DIR__ . '/controllers/IoT/',
        __DIR__ . '/controllers/Finanzas/',
        __DIR__ . '/controllers/Usuarios/',
    ];

    foreach ($directorios as $directorio) {
        $archivo = $directorio . $class . '.php';
        if (file_exists($archivo)) {
            require_once $archivo;
            return;
        }
    }
});

?>
