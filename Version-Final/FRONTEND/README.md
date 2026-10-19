# Miya Cosmetics — Frontend Angular

Conversion Angular 19 du frontend HTML/CSS/JavaScript **Miya Cosmetics** (version avec
authentification, issue de `target/classes/static` du projet Spring Boot).
`src/styles.css` est la copie exacte de `css/style.css`.

## Pré-requis
- Node.js 18.19+ (20 ou 22 recommandé) et npm
- Backend Spring Boot (dossier `BACKEND`) démarré sur **http://localhost:8088**

## Lancer
```bash
npm install
npm start        # = ng serve  → http://localhost:4200
```

## Pages (équivalences)
| Ancienne page | Route Angular |
|---|---|
| index.html    | `/` |
| admin.html    | `/admin` (sans token → `/login` ; connecté mais pas `ADMIN` → boutique) |
| login.html    | `/login` |
| register.html | `/register` |

## API
URL du backend : `src/environments/environment.ts` (`http://localhost:8088/api`).
Le JWT est stocké dans le `localStorage` (clés `token`, `role`, `nom`, `email`, comme l'original)
et envoyé en `Authorization: Bearer` aux mêmes appels que le JavaScript d'origine.
Compte admin créé par le backend : `admin@miya.com` / `admin123`.

## Dossier `original-html-miya/`
Copie de référence des fichiers HTML/CSS/JS d'origine de la version Miya Cosmetics
(`target/classes/static` du projet Spring Boot) à partir desquels l'application Angular a été convertie.
Ils ne sont pas utilisés par Angular ; ils sont conservés pour ne perdre aucune partie de votre travail.

## Sécurité côté Angular
- `guards/auth.guard.ts` : la route `/admin` exige un token **et** le rôle `ADMIN`.
- `services/session.interceptor.ts` : si le backend répond 401/403 alors qu'un token est stocké (session de 24 h expirée),
  la session est effacée et l'utilisateur est renvoyé vers `/login`.

## Dépannage
- **Page sans produits, sans catégories, sans liens Login/Register** : une valeur invalide dans le
  `localStorage` (clé `cart`, par exemple écrite par une autre application servie sur `localhost:4200`)
  bloquait l'affichage. Elle est maintenant ignorée automatiquement. Pour repartir de zéro :
  F12 > Application > Local Storage > `http://localhost:4200` > Clear all, puis Ctrl+F5.

## CSS reconstruit
Le `style.css` d'origine ne contenait aucune règle pour une soixantaine de classes utilisées par les pages
(panier, fenêtres modales, formulaire de commande, toast, mise en page admin, badges...).
Un bloc **« RÈGLES RECONSTRUITES »** a été ajouté **à la fin** de `src/styles.css` avec la palette et les variables
déjà définies (`--primary`, `--radius`...). Les 8794 premiers octets (CSS d'origine) sont inchangés.
Pour retrouver exactement le CSS d'origine, supprimez tout ce qui suit le commentaire « RÈGLES RECONSTRUITES ».
C'est une reconstruction, pas votre design d'origine : ajustez couleurs et tailles directement dans ce bloc.

## Dossier `original-html-miya/`
Copie de référence des fichiers HTML/CSS/JS d'origine de la version Miya Cosmetics
(`target/classes/static` du projet Spring Boot) à partir desquels l'application Angular a été convertie.
Ils ne sont pas utilisés par Angular ; ils sont conservés pour ne perdre aucune partie de votre travail.

## Dépannage
- **Page sans produits, sans catégories, sans liens Login/Register** : une valeur invalide dans le
  `localStorage` (clé `cart`, par exemple écrite par une autre application servie sur `localhost:4200`)
  bloquait l'affichage. Elle est maintenant ignorée automatiquement. Pour repartir de zéro :
  F12 > Application > Local Storage > `http://localhost:4200` > Clear all, puis Ctrl+F5.

## Limite connue : CSS d'origine incomplet
`src/styles.css` est la copie exacte du `style.css` de votre projet. Ce fichier ne contient aucune règle pour
une cinquantaine de classes utilisées par les pages (panier, fenêtres modales, formulaire de commande,
toast, mise en page admin...). Ces éléments s'affichent donc sans mise en forme, comme dans le projet d'origine.
