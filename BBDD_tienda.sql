-- ============================================
-- BASE DE DATOS: El Reino del Futbol
-- MYSQL
-- ============================================

CREATE DATABASE ElReinoDelFutbolDB;
USE ElReinoDelFutbolDB;

-- ============================================
-- TABLAS
-- ============================================

CREATE TABLE Categoria (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(255)
);

CREATE TABLE Producto (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion VARCHAR(255),
    Precio DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL,
    Marca VARCHAR(100),
    Talla VARCHAR(10),
    CategoriaId INT,
    CONSTRAINT FK_Producto_Categoria
        FOREIGN KEY (CategoriaId) REFERENCES Categoria(Id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE Cliente (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Email VARCHAR(150),
    Telefono VARCHAR(20),
    Direccion VARCHAR(255)
);

CREATE TABLE Pedido (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    ClienteId INT,
    Total DECIMAL(10,2) DEFAULT 0.00,
    CONSTRAINT FK_Pedido_Cliente
        FOREIGN KEY (ClienteId) REFERENCES Cliente(Id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE DetallePedido (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PedidoId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_DetallePedido_Pedido
        FOREIGN KEY (PedidoId) REFERENCES Pedido(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT FK_DetallePedido_Producto
        FOREIGN KEY (ProductoId) REFERENCES Producto(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

INSERT INTO Categoria (Nombre, Descripcion) VALUES
('Camisetas', 'Equipaciones oficiales de equipos'),
('Botas', 'Botas de futbol profesionales'),
('Balones', 'Balones de futbol'),
('Accesorios', 'Complementos deportivos');

INSERT INTO Producto (Nombre, Descripcion, Precio, Stock, Marca, Talla, CategoriaId) VALUES
('Camiseta Real Madrid 2025', 'Primera equipacion oficial', 89.99, 50, 'Adidas', 'M', 1),
('Camiseta FC Barcelona 2025', 'Primera equipacion oficial', 84.99, 40, 'Nike', 'L', 1),
('Botas Nike Mercurial', 'Botas de velocidad profesionales', 120.00, 30, 'Nike', '42', 2),
('Botas Adidas Predator', 'Botas de control y precision', 110.00, 25, 'Adidas', '43', 2),
('Balon Champions League', 'Balon oficial competicion', 39.99, 60, 'Adidas', NULL, 3),
('Espinilleras Pro', 'Proteccion profesional', 19.99, 80, 'Puma', 'M', 4);

INSERT INTO Cliente (Nombre, Apellido, Email, Telefono, Direccion) VALUES
('Juan', 'Perez', 'juan@email.com', '600123456', 'Madrid'),
('Maria', 'Garcia', 'maria@email.com', '600654321', 'Barcelona'),
('Carlos', 'Lopez', 'carlos@email.com', '600987654', 'Valencia');

INSERT INTO Pedido (ClienteId, Total) VALUES
(1, 209.99),
(2, 84.99);

INSERT INTO DetallePedido (PedidoId, ProductoId, Cantidad, PrecioUnitario, Subtotal) VALUES
(1, 1, 1, 89.99, 89.99),
(1, 3, 1, 120.00, 120.00),
(2, 2, 1, 84.99, 84.99);

