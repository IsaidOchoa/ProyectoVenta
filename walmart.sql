-- Script para crear la base de datos y las tablas necesarias para el sistema de Walmart en workbench

CREATE DATABASE IF NOT EXISTS walmart;
USE walmart;
-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    correo VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    contrasena VARCHAR(255),
    pais VARCHAR(50),
    estado_direccion VARCHAR(50),
    ciudad VARCHAR(50),
    calle VARCHAR(100),
    colonia VARCHAR(100),
    codigo_postal VARCHAR(10),
    numero_domicilio VARCHAR(10),
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    estado_usuario TINYINT DEFAULT 1,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    direccion VARCHAR(255),
    telefono VARCHAR(50)
);

-- Tabla de categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100)
);

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    stock INT,
    categoria_id INT,
    proveedor_id INT,
    imagen VARCHAR(255),
    estado TINYINT DEFAULT 1,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);
-- Carrito temporal
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    cantidad INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2),
    estado ENUM('en bodega', 'en camino', 'entregado') DEFAULT 'en bodega',
    numero_ticket INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Detalle de la venta (snapshot incluido)
CREATE TABLE venta_detalle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    nombre_producto_snapshot VARCHAR(100),
    precio_unitario DECIMAL(10,2),
    cantidad INT,
    total DECIMAL(10,2),
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Categorías
INSERT INTO categorias (nombre_categoria) VALUES
  ('comida'),
  ('electronica'),
  ('ropa'),
  ('hogar');

-- Proveedores
INSERT INTO proveedores (nombre, direccion, telefono) VALUES
  ('Proveedor A', 'Dirección A', '1111111111'),
  ('Proveedor B', 'Dirección B', '2222222222'),
  ('Proveedor C', 'Dirección C', '3333333333'),
  ('Proveedor D', 'Dirección D', '4444444444'),
  ('Proveedor E', 'Dirección E', '5555555555'),
  ('Proveedor F', 'Dirección F', '6666666666'),
  ('Proveedor G', 'Dirección G', '7777777777'),
  ('Proveedor H', 'Dirección H', '8888888888'),
  ('Proveedor I', 'Dirección I', '9999999999'),
  ('Proveedor J', 'Dirección J', '1010101010');

-- Productos
INSERT INTO productos (nombre, categoria_id, proveedor_id, descripcion, precio, stock, imagen) VALUES
  ('Manzanas', 1, 1, 'Manzanas rojas frescas', 2.99, 100, 'manzanas_rojas.jpg'),
  ('Laptop Lenovo', 2, 2, 'Laptop Lenovo Ideapad 15.6 pulgadas', 549.99, 50, 'laptop_lenovo.jpg'),
  ('Camisa Azul', 3, 3, 'Camisa de algodón azul talla M', 19.99, 200, 'camisa_azul.jpg'),
  ('Televisión Samsung 32"', 2, 4, 'Televisión Samsung 32 pulgadas, LED', 249.99, 30, 'pantalla_samsung_32.jpg'),
  ('Cereal ChocoZucaritas', 1, 5, 'Cereal ChocoZucaritas 500g', 3.49, 150, 'chocozucaritas.jpg'),
  ('Sartén Antiadherente', 4, 6, 'Sartén antiadherente 28cm', 14.99, 80, 'sarten_antiadherente.jpg'),
  ('Pantalón Jeans', 3, 7, 'Pantalón jeans azul oscuro, talla 32', 39.99, 120, 'pantalon_jeans_azul.jpg'),
  ('Celular Xiaomi', 2, 8, 'Smartphone Xiaomi Redmi Note 10', 199.99, 70, 'celular_xiaomi.jpg'),
  ('Papel Higiénico', 4, 9, 'Papel higiénico 12 rollos', 5.99, 200, 'papel_higienico_petalo.jpg'),
  ('Queso Oaxaca', 1, 10, 'Queso Oaxaca fresco 500g', 6.49, 50, 'queso_oaxaca.jpg');

-- Usuario admin (contraseña ya encriptada)
INSERT INTO usuarios (
  nombre, apellido, correo, telefono, contrasena,
  pais, estado_direccion, ciudad, calle, colonia,
  codigo_postal, numero_domicilio, rol, estado_usuario
) VALUES (
  'Isaid', 'Ochoa', 'admin2@example.com', '123456',
  '$2y$10$Sj3u24mWzPZTuw7V1UJKA.h6tsVp7qhFtdM3T0QIt2c4mdKCy53n6',
  'México', 'CDMX', 'Ciudad de México', 'Insurgentes',
  'Centro', '01000', '123', 'admin', 1
);
