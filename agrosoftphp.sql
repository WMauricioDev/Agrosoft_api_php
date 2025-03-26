-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 26-03-2025 a las 03:01:46
-- Versión del servidor: 9.0.1
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agrosoftphp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id` bigint UNSIGNED NOT NULL,
  `fk_cultivo` int NOT NULL,
  `fk_usuario` int NOT NULL,
  `fk_insumo` bigint UNSIGNED DEFAULT NULL,
  `fk_programacion` int DEFAULT NULL,
  `fk_tipo_actividad` int NOT NULL,
  `titulo` varchar(100) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `fecha` date NOT NULL,
  `cantidad_producto` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`id`, `fk_cultivo`, `fk_usuario`, `fk_insumo`, `fk_programacion`, `fk_tipo_actividad`, `titulo`, `descripcion`, `fecha`, `cantidad_producto`) VALUES
(1, 1, 1, 1, 1, 1, 'Riego ', 'Primer riego del cultivo para asegurar hidratación.', '2024-03-04', 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `afecciones`
--

CREATE TABLE `afecciones` (
  `id` int NOT NULL,
  `prioridad` enum('Alta','Media','Baja') COLLATE utf8mb3_spanish2_ci NOT NULL,
  `fecha_encuentro` date DEFAULT NULL,
  `fk_plantacion` int NOT NULL,
  `fk_plaga` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bancal`
--

CREATE TABLE `bancal` (
  `id` int NOT NULL,
  `fk_lote` int NOT NULL,
  `nombre` varchar(70) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `tamx` decimal(10,2) DEFAULT NULL,
  `tamy` decimal(10,2) DEFAULT NULL,
  `posx` decimal(10,2) DEFAULT NULL,
  `posy` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `bancal`
--

INSERT INTO `bancal` (`id`, `fk_lote`, `nombre`, `tamx`, `tamy`, `posx`, `posy`) VALUES
(5, 1, 'Bancal A', 3.33, 3.33, 3.33, 3.33);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bodega`
--

CREATE TABLE `bodega` (
  `id_bodega` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `ubicacion` varchar(200) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `tipo_bodega` enum('Semillero','Cosecha','Herramientas') COLLATE utf8mb3_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `bodega`
--

INSERT INTO `bodega` (`id_bodega`, `nombre`, `ubicacion`, `tipo_bodega`) VALUES
(1, 'ada', 'adasd', 'Cosecha'),
(2, 'Bodega Central', 'Sector 1, Bloque A', 'Herramientas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `controles`
--

CREATE TABLE `controles` (
  `id` int NOT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci,
  `fecha_control` date DEFAULT NULL,
  `cantidad_producto` int DEFAULT NULL,
  `fk_afecciones` int NOT NULL,
  `fk_tipo_control` int NOT NULL,
  `fk_productos_control` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cosechas`
--

CREATE TABLE `cosechas` (
  `id` int NOT NULL,
  `fk_cultivo` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `cantidad` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `cosechas`
--

INSERT INTO `cosechas` (`id`, `fk_cultivo`, `fecha`, `cantidad`) VALUES
(2, 1, '2025-03-23', 5),
(3, 1, '2025-03-25', 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cultivos`
--

CREATE TABLE `cultivos` (
  `id` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `unidad_de_medida` int DEFAULT NULL,
  `estado` enum('activo','inactivo') COLLATE utf8mb3_spanish2_ci NOT NULL,
  `fecha_siembra` date DEFAULT NULL,
  `fk_especie` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `cultivos`
--

INSERT INTO `cultivos` (`id`, `nombre`, `unidad_de_medida`, `estado`, `fecha_siembra`, `fk_especie`) VALUES
(1, 'Cultivo de Lechugas', 100, 'activo', '2024-03-01', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_meteorologicos`
--

CREATE TABLE `datos_meteorologicos` (
  `id_dato_meteorologico` varchar(200) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `fecha_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_dato` int DEFAULT NULL,
  `valor` int DEFAULT NULL,
  `fk_sensor_bancal` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especies`
--

CREATE TABLE `especies` (
  `id` int NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `tiempo_crecimiento` varchar(50) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `fk_tipo_especie` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `especies`
--

INSERT INTO `especies` (`id`, `nombre`, `descripcion`, `tiempo_crecimiento`, `fk_tipo_especie`) VALUES
(1, 'Hortaliza', 'Planta de hojas verdes utilizada en ensaladas.', '30 días', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fase_lunar`
--

CREATE TABLE `fase_lunar` (
  `id` bigint UNSIGNED NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `herramientas`
--

CREATE TABLE `herramientas` (
  `id` int NOT NULL,
  `fk_bodega` int NOT NULL,
  `nombre` varchar(30) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(200) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `unidades` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `herramientas`
--

INSERT INTO `herramientas` (`id`, `fk_bodega`, `nombre`, `descripcion`, `unidades`) VALUES
(1, 2, 'aasd', 'asd', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `insumos`
--

CREATE TABLE `insumos` (
  `id` bigint UNSIGNED NOT NULL,
  `fk_bodega` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci,
  `precio` float DEFAULT NULL,
  `cantidad` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `insumos`
--

INSERT INTO `insumos` (`id`, `fk_bodega`, `nombre`, `descripcion`, `precio`, `cantidad`) VALUES
(1, 0, 'Fertilizante Orgánico', 'Fertilizante natural rico en nutrientes esenciales', 25.5, 10),
(3, 2, 'insumosa', 'phpinsumo', 1000, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes`
--

CREATE TABLE `lotes` (
  `id` int NOT NULL,
  `nombre` varchar(15) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci,
  `tamx` float NOT NULL,
  `tamy` float NOT NULL,
  `estado` enum('activo','ocupado','en proceso de adecuamiento') COLLATE utf8mb3_spanish2_ci NOT NULL,
  `posx` decimal(10,6) DEFAULT NULL,
  `posy` decimal(10,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `lotes`
--

INSERT INTO `lotes` (`id`, `nombre`, `descripcion`, `tamx`, `tamy`, `estado`, `posx`, `posy`) VALUES
(1, 'Lote 2', 'Lote destinado para cultivo de maíz.', 50.5, 30.2, 'activo', 12.345000, 67.890000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plagas`
--

CREATE TABLE `plagas` (
  `id` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci,
  `fk_tipo_plaga` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `plagas`
--

INSERT INTO `plagas` (`id`, `nombre`, `descripcion`, `fk_tipo_plaga`) VALUES
(2, 'pulgon', 'asd', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plantaciones`
--

CREATE TABLE `plantaciones` (
  `id` int NOT NULL,
  `fk_cultivo` int NOT NULL,
  `fk_bancal` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_control`
--

CREATE TABLE `productos_control` (
  `id` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `precio` float DEFAULT NULL,
  `ficha_tecnica` text COLLATE utf8mb3_spanish2_ci,
  `contenido` int DEFAULT NULL,
  `tipo_contenido` varchar(50) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `unidades` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programacion`
--

CREATE TABLE `programacion` (
  `id_programacion` int NOT NULL,
  `ubicacion` varchar(100) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `estado` varchar(300) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `fecha_prog` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `programacion`
--

INSERT INTO `programacion` (`id_programacion`, `ubicacion`, `estado`, `fecha_prog`) VALUES
(1, 'Campo A', 'asdad', '2024-03-05'),
(2, 'campo', 'finalizada', '2025-03-23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `residuos`
--

CREATE TABLE `residuos` (
  `id` bigint UNSIGNED NOT NULL,
  `fk_cultivo` int NOT NULL,
  `fk_tipo` bigint UNSIGNED NOT NULL,
  `nombre` varchar(30) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci,
  `fecha` date NOT NULL,
  `tipo` varchar(50) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `cantidad` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `nombre_rol` varchar(100) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `fecha_creacion` date DEFAULT (curdate()),
  `ultima_actualizacion` date DEFAULT (curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre_rol`, `fecha_creacion`, `ultima_actualizacion`) VALUES
(1, 'Administrador', '2025-03-04', '2025-03-04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salario_minimo`
--

CREATE TABLE `salario_minimo` (
  `id` bigint UNSIGNED NOT NULL,
  `valor` float NOT NULL,
  `fecha_aplicacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `semilleros`
--

CREATE TABLE `semilleros` (
  `id` int NOT NULL,
  `fk_especie` int NOT NULL,
  `unidad_medida` varchar(50) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `fecha_siembra` date DEFAULT NULL,
  `fecha_estimada` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sensores`
--

CREATE TABLE `sensores` (
  `id_sensor` int NOT NULL,
  `nombre` varchar(30) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `tipo_sensor` varchar(80) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `unidad_medida` varchar(30) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `medida_min` float DEFAULT NULL,
  `medida_max` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sensores_bancal`
--

CREATE TABLE `sensores_bancal` (
  `id` int NOT NULL,
  `fk_sensor` int NOT NULL,
  `fk_bancal` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_control`
--

CREATE TABLE `tipos_control` (
  `id` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `tipos_control`
--

INSERT INTO `tipos_control` (`id`, `nombre`, `descripcion`) VALUES
(1, 'control 2', 'control');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_residuo`
--

CREATE TABLE `tipos_residuo` (
  `id` bigint UNSIGNED NOT NULL,
  `nombre` varchar(20) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `descripcion` varchar(100) COLLATE utf8mb3_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `tipos_residuo`
--

INSERT INTO `tipos_residuo` (`id`, `nombre`, `descripcion`) VALUES
(1, 'toxico', 'toxico'),
(2, 'organico', 'organico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_actividad`
--

CREATE TABLE `tipo_actividad` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `tipo_actividad`
--

INSERT INTO `tipo_actividad` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Riego', 'Actividad de riego para mantener la humedad del suelo en niveles óptimos.'),
(2, 'abonar', 'abonar'),
(4, 'riego', 'riego');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_especie`
--

CREATE TABLE `tipo_especie` (
  `id` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci,
  `img` varchar(255) COLLATE utf8mb3_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `tipo_especie`
--

INSERT INTO `tipo_especie` (`id`, `nombre`, `descripcion`, `img`) VALUES
(1, 'Hortaliza', 'Plantas cultivadas para consumo humano, como lechuga y zanahoria.', 'hortaliza.jpg'),
(2, 'frutal', 'frutal', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_plaga`
--

CREATE TABLE `tipo_plaga` (
  `id` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_spanish2_ci,
  `img` varchar(255) COLLATE utf8mb3_spanish2_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `tipo_plaga`
--

INSERT INTO `tipo_plaga` (`id`, `nombre`, `descripcion`, `img`) VALUES
(1, 'Pulgón', 'Pequeños insectos que chupan la savia de las plantas, debilitándolas.', 'https://example.com/img/pulgon.jpg'),
(2, 'Puadadaslgón', 'Pequeños insectos que chupan la savia de las plantas, debilitándolas.', 'https://example.com/img/pulgon.jpg'),
(3, 'ad', 'asd', NULL),
(4, 'asasd', 'sda', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `identificacion` bigint NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `apellido` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `area_desarrollo` varchar(100) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `fk_rol` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `identificacion`, `nombre`, `apellido`, `fecha_nacimiento`, `telefono`, `email`, `password`, `area_desarrollo`, `fk_rol`) VALUES
(1, 1001234567, 'Mauricio', 'Pérez', '1990-05-15', '3001234567', 'juan.perez@example.com', '$2y$10$IohRcPYaW0uRr25AM0oeDOjddCLXkYUARsU2/AjIM2/8Db4NtvooW', 'Desarrollo Web', 1),
(4, 2313432, 'Juan', 'Pérez', '1990-05-15', '3001234567', 'pablo.perez@example.com', '$2y$10$hTTs5xaoJxd8.o0XkMZxeefdrEkLaMektf4KWdQXq.pUL15MjI0CS', 'Desarrollo Web', 1),
(5, 123, 'Juan Pablo', 'Audor Bernal', '2025-03-10', '3219818019', 'mauricio@gmail.com', '$2y$10$OHT7z2ziM6T7qtFFvuY2X.8DTq7HUynAjg9CtPw1L0fEZ5D8rSvqq', 's', 1),
(7, 9876, 'mauricio', 'audor', '2025-03-25', '3209607365', 'm@gmail.com', '12345', 'desarrollador', 1),
(9, 567, 'Mauricio', 'wasa', '2025-03-25', '3211313', 'h@gmail.com', '$2y$10$BAVyx4uNjRT/pqikPaFI8.CrNBA7J7g3m6ZR0R4kAzXoENXYaxZAO', 'desarrollador', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id` bigint UNSIGNED NOT NULL,
  `fk_cosecha` int NOT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `producto_vendido` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `cantidad` int NOT NULL,
  `fecha_venta` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_actividades_cultivo` (`fk_cultivo`),
  ADD KEY `fk_actividades_usuario` (`fk_usuario`),
  ADD KEY `fk_actividades_insumo` (`fk_insumo`),
  ADD KEY `fk_actividades_programacion` (`fk_programacion`),
  ADD KEY `fk_actividades_tipo_actividad` (`fk_tipo_actividad`);

--
-- Indices de la tabla `afecciones`
--
ALTER TABLE `afecciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_afecciones_plantacion` (`fk_plantacion`),
  ADD KEY `fk_afecciones_plaga` (`fk_plaga`);

--
-- Indices de la tabla `bancal`
--
ALTER TABLE `bancal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bancal_lote` (`fk_lote`);

--
-- Indices de la tabla `bodega`
--
ALTER TABLE `bodega`
  ADD PRIMARY KEY (`id_bodega`);

--
-- Indices de la tabla `controles`
--
ALTER TABLE `controles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_controles_afecciones` (`fk_afecciones`),
  ADD KEY `fk_controles_tipo_control` (`fk_tipo_control`),
  ADD KEY `fk_controles_productos_control` (`fk_productos_control`);

--
-- Indices de la tabla `cosechas`
--
ALTER TABLE `cosechas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cosechas_cultivo` (`fk_cultivo`);

--
-- Indices de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cultivos_especie` (`fk_especie`);

--
-- Indices de la tabla `datos_meteorologicos`
--
ALTER TABLE `datos_meteorologicos`
  ADD PRIMARY KEY (`id_dato_meteorologico`),
  ADD KEY `fk_datos_meteorologicos_sensor_bancal` (`fk_sensor_bancal`);

--
-- Indices de la tabla `especies`
--
ALTER TABLE `especies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_especies_tipo` (`fk_tipo_especie`);

--
-- Indices de la tabla `fase_lunar`
--
ALTER TABLE `fase_lunar`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `herramientas`
--
ALTER TABLE `herramientas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_insumos_bodega` (`fk_bodega`);

--
-- Indices de la tabla `insumos`
--
ALTER TABLE `insumos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `plagas`
--
ALTER TABLE `plagas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_plagas_tipo` (`fk_tipo_plaga`);

--
-- Indices de la tabla `plantaciones`
--
ALTER TABLE `plantaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_plantaciones_cultivo` (`fk_cultivo`),
  ADD KEY `fk_plantaciones_bancal` (`fk_bancal`);

--
-- Indices de la tabla `productos_control`
--
ALTER TABLE `productos_control`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `programacion`
--
ALTER TABLE `programacion`
  ADD PRIMARY KEY (`id_programacion`);

--
-- Indices de la tabla `residuos`
--
ALTER TABLE `residuos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_residuos_cultivo` (`fk_cultivo`),
  ADD KEY `fk_residuos_tipo` (`fk_tipo`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `salario_minimo`
--
ALTER TABLE `salario_minimo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `semilleros`
--
ALTER TABLE `semilleros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_semilleros_especie` (`fk_especie`);

--
-- Indices de la tabla `sensores`
--
ALTER TABLE `sensores`
  ADD PRIMARY KEY (`id_sensor`);

--
-- Indices de la tabla `sensores_bancal`
--
ALTER TABLE `sensores_bancal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sensores_bancal_sensor` (`fk_sensor`),
  ADD KEY `fk_sensores_bancal_bancal` (`fk_bancal`);

--
-- Indices de la tabla `tipos_control`
--
ALTER TABLE `tipos_control`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipos_residuo`
--
ALTER TABLE `tipos_residuo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `tipo_actividad`
--
ALTER TABLE `tipo_actividad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipo_especie`
--
ALTER TABLE `tipo_especie`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipo_plaga`
--
ALTER TABLE `tipo_plaga`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identificacion` (`identificacion`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_usuarios_roles` (`fk_rol`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_venta_cosecha` (`fk_cosecha`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `afecciones`
--
ALTER TABLE `afecciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `bancal`
--
ALTER TABLE `bancal`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `bodega`
--
ALTER TABLE `bodega`
  MODIFY `id_bodega` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `controles`
--
ALTER TABLE `controles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cosechas`
--
ALTER TABLE `cosechas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `especies`
--
ALTER TABLE `especies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `fase_lunar`
--
ALTER TABLE `fase_lunar`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `herramientas`
--
ALTER TABLE `herramientas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `insumos`
--
ALTER TABLE `insumos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `lotes`
--
ALTER TABLE `lotes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `plagas`
--
ALTER TABLE `plagas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `plantaciones`
--
ALTER TABLE `plantaciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos_control`
--
ALTER TABLE `productos_control`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `programacion`
--
ALTER TABLE `programacion`
  MODIFY `id_programacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `residuos`
--
ALTER TABLE `residuos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `salario_minimo`
--
ALTER TABLE `salario_minimo`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `semilleros`
--
ALTER TABLE `semilleros`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sensores`
--
ALTER TABLE `sensores`
  MODIFY `id_sensor` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sensores_bancal`
--
ALTER TABLE `sensores_bancal`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_control`
--
ALTER TABLE `tipos_control`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tipos_residuo`
--
ALTER TABLE `tipos_residuo`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_actividad`
--
ALTER TABLE `tipo_actividad`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tipo_especie`
--
ALTER TABLE `tipo_especie`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipo_plaga`
--
ALTER TABLE `tipo_plaga`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `fk_actividades_cultivo` FOREIGN KEY (`fk_cultivo`) REFERENCES `cultivos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_actividades_insumo` FOREIGN KEY (`fk_insumo`) REFERENCES `insumos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_actividades_programacion` FOREIGN KEY (`fk_programacion`) REFERENCES `programacion` (`id_programacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_actividades_tipo_actividad` FOREIGN KEY (`fk_tipo_actividad`) REFERENCES `tipo_actividad` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_actividades_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `afecciones`
--
ALTER TABLE `afecciones`
  ADD CONSTRAINT `fk_afecciones_plaga` FOREIGN KEY (`fk_plaga`) REFERENCES `plagas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_afecciones_plantacion` FOREIGN KEY (`fk_plantacion`) REFERENCES `plantaciones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `bancal`
--
ALTER TABLE `bancal`
  ADD CONSTRAINT `fk_bancal_lote` FOREIGN KEY (`fk_lote`) REFERENCES `lotes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `controles`
--
ALTER TABLE `controles`
  ADD CONSTRAINT `fk_controles_afecciones` FOREIGN KEY (`fk_afecciones`) REFERENCES `afecciones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_controles_productos_control` FOREIGN KEY (`fk_productos_control`) REFERENCES `productos_control` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_controles_tipo_control` FOREIGN KEY (`fk_tipo_control`) REFERENCES `tipos_control` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cosechas`
--
ALTER TABLE `cosechas`
  ADD CONSTRAINT `fk_cosechas_cultivo` FOREIGN KEY (`fk_cultivo`) REFERENCES `cultivos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cultivos`
--
ALTER TABLE `cultivos`
  ADD CONSTRAINT `fk_cultivos_especie` FOREIGN KEY (`fk_especie`) REFERENCES `especies` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `datos_meteorologicos`
--
ALTER TABLE `datos_meteorologicos`
  ADD CONSTRAINT `fk_datos_meteorologicos_sensor_bancal` FOREIGN KEY (`fk_sensor_bancal`) REFERENCES `sensores_bancal` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `especies`
--
ALTER TABLE `especies`
  ADD CONSTRAINT `fk_especies_tipo` FOREIGN KEY (`fk_tipo_especie`) REFERENCES `tipo_especie` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `herramientas`
--
ALTER TABLE `herramientas`
  ADD CONSTRAINT `fk_herramientas_bodega` FOREIGN KEY (`fk_bodega`) REFERENCES `bodega` (`id_bodega`),
  ADD CONSTRAINT `fk_insumos_bodega` FOREIGN KEY (`fk_bodega`) REFERENCES `bodega` (`id_bodega`);

--
-- Filtros para la tabla `plagas`
--
ALTER TABLE `plagas`
  ADD CONSTRAINT `fk_plagas_tipo` FOREIGN KEY (`fk_tipo_plaga`) REFERENCES `tipo_plaga` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `plantaciones`
--
ALTER TABLE `plantaciones`
  ADD CONSTRAINT `fk_plantaciones_bancal` FOREIGN KEY (`fk_bancal`) REFERENCES `bancal` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_plantaciones_cultivo` FOREIGN KEY (`fk_cultivo`) REFERENCES `cultivos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `residuos`
--
ALTER TABLE `residuos`
  ADD CONSTRAINT `fk_residuos_cultivo` FOREIGN KEY (`fk_cultivo`) REFERENCES `cultivos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_residuos_tipo` FOREIGN KEY (`fk_tipo`) REFERENCES `tipos_residuo` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `semilleros`
--
ALTER TABLE `semilleros`
  ADD CONSTRAINT `fk_semilleros_especie` FOREIGN KEY (`fk_especie`) REFERENCES `especies` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sensores_bancal`
--
ALTER TABLE `sensores_bancal`
  ADD CONSTRAINT `fk_sensores_bancal_bancal` FOREIGN KEY (`fk_bancal`) REFERENCES `bancal` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sensores_bancal_sensor` FOREIGN KEY (`fk_sensor`) REFERENCES `sensores` (`id_sensor`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`fk_rol`) REFERENCES `roles` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `fk_venta_cosecha` FOREIGN KEY (`fk_cosecha`) REFERENCES `cosechas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
