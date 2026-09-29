-- Monorepo MySQL Complete Relational Database Schema
CREATE DATABASE IF NOT EXISTS proj2_db;
USE proj2_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL DEFAULT 'User',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS Products (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    CategoryId INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id) ON DELETE SET NULL
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    ShippingAddress TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 5. OrderItems Table
CREATE TABLE IF NOT EXISTS OrderItems (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- 6. Initial Seed Data
INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES
('admin', 'admin@proj2.local', 'admin123', 'Admin'),
('johndoe', 'john@example.com', 'user123', 'User'),
('ahmedraza', 'ahmedraza@proj2.local', 'ahmedraza', 'Admin')
ON DUPLICATE KEY UPDATE Id=Id;

INSERT INTO Categories (Id, Name, Description) VALUES
(1, 'Hardware & Devices', 'Networking gear, gadgets, and physical hardware'),
(2, 'Software & Cloud Services', 'SaaS subscriptions, enterprise software, and dev tools'),
(3, 'DevOps Tools', 'Monitoring, CI/CD, and container management utilities')
ON DUPLICATE KEY UPDATE Id=Id;

INSERT INTO Products (Id, Name, Description, Price, StockQuantity, CategoryId) VALUES
(1, 'Cloud Server Plan A', 'Scalable enterprise cloud instance with 8 vCPUs and 32GB RAM', 49.99, 100, 2),
(2, 'DevOps Observability Toolkit', 'Real-time APM, logging, and infrastructure monitoring platform', 199.00, 50, 3),
(3, 'High-Speed Mesh Router X', 'Gigabit WiFi 6 Mesh Router with built-in VPN server', 129.50, 30, 1),
(4, 'Managed Database Pro', 'High availability MySQL database cluster with daily backups', 89.99, 75, 2)
ON DUPLICATE KEY UPDATE Id=Id;

INSERT INTO Orders (Id, UserId, TotalAmount, Status, ShippingAddress) VALUES
(1, 2, 179.49, 'Completed', '123 Tech Boulevard, Silicon Valley, CA')
ON DUPLICATE KEY UPDATE Id=Id;

INSERT INTO OrderItems (Id, OrderId, ProductId, Quantity, UnitPrice) VALUES
(1, 1, 1, 1, 49.99),
(2, 1, 3, 1, 129.50)
ON DUPLICATE KEY UPDATE Id=Id;
