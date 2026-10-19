-- =====================================================
-- Script SQL - Base de données ShopEasy E-commerce
-- Projet Spring Boot DSI ISET Gafsa 2025-2026
-- =====================================================

CREATE DATABASE IF NOT EXISTS ecommerce_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

-- TABLE: categories
CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLE: products
CREATE TABLE IF NOT EXISTS products (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price       DECIMAL(10,2) NOT NULL,
    stock       INT NOT NULL DEFAULT 0,
    image_url   VARCHAR(500),
    category_id BIGINT,
    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLE: orders
CREATE TABLE IF NOT EXISTS orders (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name    VARCHAR(200) NOT NULL,
    customer_email   VARCHAR(200) NOT NULL,
    customer_phone   VARCHAR(50)  NOT NULL,
    shipping_address TEXT         NOT NULL,
    total_amount     DECIMAL(10,2) NOT NULL,
    status           ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') DEFAULT 'PENDING',
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABLE: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity   INT    NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- NOTE: Les données de démonstration sont insérées automatiquement
-- au premier démarrage par DataInitializer.java
-- Vérification après démarrage:
-- SELECT * FROM categories;
-- SELECT * FROM products;
-- SELECT * FROM orders;
