# 11_scripts_et_commandes.md

## Backend (Spring Boot)

| Commande | Description |
|---|---|
| `./mvnw spring-boot:run` | Lancer le backend en développement |
| `./mvnw clean install` | Compiler et packager le projet |
| `./mvnw test` | Lancer les tests |

## Frontend (React/Vite)

| Commande | Description |
|---|---|
| `npm run dev` | Lancer le frontend en développement |
| `npm run build` | Compiler pour la production |
| `npm run preview` | Prévisualiser le build de prod |
| `npm run lint` | Vérifier le code avec ESLint |

## Docker (Makefile racine)

| Commande | Description |
|---|---|
| `make up` | Démarrer les conteneurs Docker |
| `make down` | Arrêter les conteneurs |
| `make build` | Builder les images Docker |
| `make logs` | Afficher les logs en temps réel |
| `make ps` | Lister les conteneurs actifs |

## Vérification
- `./mvnw spring-boot:run` : testé
- `npm run build` : testé (135 modules, aucune erreur)
