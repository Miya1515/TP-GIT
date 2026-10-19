# Backend Spring Boot — E-commerce (Miya Cosmetics) — version SANS Lombok

Projet Maven (Spring Boot 3.2.5, Java 17, MySQL, JWT). Le code ne dépend plus de Lombok :
aucun plugin Lombok n'est nécessaire dans STS, IntelliJ ou VS Code.
L'ancien README du projet est conservé dans `README_ORIGINAL.md`.

## 1. Pré-requis
- JDK 17 (pas un simple JRE)
- MySQL 8 démarré sur `localhost:3306`
- STS (Spring Tools for Eclipse) ou Maven 3.9+ en ligne de commande

## 2. Configurer MySQL
Tout se règle dans `src/main/resources/application.properties` (valeurs d'origine, inchangées) :
```
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true&...
spring.datasource.username=root
spring.datasource.password=          <-- vide ; mettez votre mot de passe MySQL si besoin
spring.jpa.hibernate.ddl-auto=update
server.port=8088
```
- La base `ecommerce_db` et les tables sont créées automatiquement au premier démarrage.
- Au premier démarrage, 5 catégories / 50 produits sont insérés (`DataInitializer`) et un compte admin est créé :
  **admin@miya.com / admin123**
- `database.sql` (script d'origine) est conservé tel quel ; il n'est pas nécessaire pour démarrer.

## 3. Importer dans STS
1. `File > Import > Maven > Existing Maven Projects` → dossier `BACKEND` → `Finish`.
   (Si un projet `ecommerce-app` existe déjà dans le workspace : `Advanced > Name template` = `[artifactId]-backend`.)
2. Attendre la fin du téléchargement des dépendances Maven.
3. Si besoin : clic droit sur le projet > `Maven > Update Project...` (cocher *Force Update*).

## 4. Lancer
- STS : clic droit sur `EcommerceApplication.java` > `Run As > Spring Boot App`
  (ou clic droit sur le projet > `Run As > Maven build...` avec le goal `spring-boot:run`).
- Terminal, dans le dossier `BACKEND` : `mvn spring-boot:run`
- Compiler seulement : `mvn clean compile`

Test rapide : http://localhost:8088/api/products doit renvoyer du JSON.
(L'ancien frontend HTML est toujours servi par Spring sur http://localhost:8088/.)

## 5. Ce qui a changé par rapport à l'original (uniquement la suppression de Lombok)
- `pom.xml` : dépendance `org.projectlombok:lombok` et son `exclude` dans `spring-boot-maven-plugin` retirés.
- Remplacement des annotations Lombok par du code Java standard équivalent dans 17 fichiers :
  - `model/` Category, Order, OrderItem, Product, User et `dto/` AuthResponse, LoginRequest, RegisterRequest
    (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`) : constructeurs, getters/setters,
    `equals`/`canEqual`/`hashCode`/`toString` et classes `XxxBuilder` écrits explicitement.
  - `config/SecurityConfig`, `security/JwtFilter`, `controller/*` (4), `service/*` (3) (`@RequiredArgsConstructor`) :
    constructeur explicite avec injection par constructeur.
- `src/main/resources/static/css/style.css` : un bloc « RÈGLES RECONSTRUITES » a été ajouté à la fin (CSS seulement ; les
  lignes d'origine sont intactes). Il complète l'ancien frontend HTML servi sur http://localhost:8088/.
- `config/SecurityConfig.java` : **seules les règles d'autorisation ont changé** (voir `../COMPTE_RENDU.md`) :
  écritures produits/catégories et gestion des commandes réservées au rôle `ADMIN` ; `POST /api/orders` ouvert aux visiteurs.
  Avant, ces opérations étaient accessibles sans token ou à tout utilisateur connecté.
- Aucun endpoint, aucune règle métier, aucune configuration ni aucun fichier SQL modifié.
- Le dossier `target/` (sortie de compilation) n'est pas inclus : Maven le régénère.
