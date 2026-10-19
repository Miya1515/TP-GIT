# ShopEasy - Application E-commerce Spring Boot

Projet DSI - ISET Gafsa | Année Universitaire 2025-2026

---

## Prérequis

- Java JDK 17+  →  https://adoptium.net
- Maven 3.8+    →  https://maven.apache.org
- MySQL 8.0+    →  https://dev.mysql.com/downloads/
- IntelliJ IDEA →  https://www.jetbrains.com/idea/

---

## Étapes pour lancer le projet

### ÉTAPE 1 - Extraire le ZIP
Décompressez ecommerce-app.zip dans un dossier (ex: C:\projets\ecommerce-app)

### ÉTAPE 2 - Configurer MySQL
Créez la base de données:
    CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

### ÉTAPE 3 - Modifier application.properties
Fichier: src/main/resources/application.properties
    spring.datasource.username=root      (votre username MySQL)
    spring.datasource.password=root      (votre mot de passe MySQL)

### ÉTAPE 4 - Ouvrir dans IntelliJ IDEA
File > Open > sélectionner le dossier du projet > Trust Project
Attendre le chargement des dépendances Maven (~2-5 min la 1ère fois)

### ÉTAPE 5 - Lancer l'application
Ouvrir: src/main/java/com/ecommerce/EcommerceApplication.java
Cliquer sur le bouton ▶️ vert > Run 'EcommerceApplication'

### ÉTAPE 6 - Accéder à l'application
Boutique:      http://localhost:8080
Administration: http://localhost:8080/admin.html
API REST:       http://localhost:8080/api/products

---

## Fonctionnalités

Front Office (Client):
- Liste et filtrage des produits par catégorie
- Recherche de produits
- Vue détaillée d'un produit
- Panier (ajout, modification quantité, suppression)
- Passage de commande avec formulaire client

Back Office (Admin):
- Dashboard avec statistiques (produits, commandes, CA)
- CRUD Produits (ajouter, modifier, supprimer)
- CRUD Catégories
- Gestion des commandes avec changement de statut

---

## Architecture

Backend: Spring Boot 3.2 + Spring Data JPA + Hibernate
Base de données: MySQL 8
Frontend: HTML5 + CSS3 + JavaScript (Vanilla)
API: REST JSON

Modèle de données:
  categories (id, name, description)
       |
  products (id, name, description, price, stock, imageUrl, category_id)
       |
  order_items (id, order_id, product_id, quantity, unit_price)
       |
  orders (id, customerName, customerEmail, customerPhone, shippingAddress, totalAmount, status, createdAt)

---

## Problèmes fréquents

Erreur MySQL "Communications link failure"
→ Vérifier que MySQL Server est démarré
→ Vérifier username/password dans application.properties

Port 8080 occupé
→ Changer dans application.properties: server.port=8081

Lombok non reconnu (erreurs sur @Data, @Builder...)
→ IntelliJ: File > Settings > Plugins > chercher "Lombok" > Installer > Redémarrer
