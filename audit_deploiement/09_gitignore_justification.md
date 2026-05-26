# 09_gitignore_justification.md

## Fichiers exclus et justifications

| Fichier / Dossier | Raison |
|---|---|
| `target/` | Généré par Maven, régénérable via `mvn build` |
| `node_modules/` | Dépendances npm, régénérables via `npm install` |
| `dist/` | Build Vite généré, ne fait pas partie du source |
| `application.properties` | Contient credentials MySQL, MongoDB et JWT |
| `application-test.properties` | Contient credentials de test |
| `.env` | Variables d'environnement sensibles |
| `.DS_Store` | Fichier système macOS |
| `*.log` | Logs générés à l'exécution |
| `.idea/`, `*.iml` | Configuration IDE, propre à chaque dev |

## Conclusion
Trois catégories : fichiers générés (target, dist, node_modules),
fichiers sensibles (properties, .env) et fichiers système/IDE (.DS_Store, .idea).
