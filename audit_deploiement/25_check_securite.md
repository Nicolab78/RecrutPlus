# 25_check_securite.md

## Vérifications effectuées

| Élément | Statut | Commentaire |
|---|---|---|
| Fichiers sensibles exclus du dépôt | X | application.properties dans .gitignore |
| Variables d'environnement externalisées | X| MySQL, MongoDB, JWT via variables d'env |
| JWT configuré | X | Clé secrète externalisée |
| Mots de passe hashés (BCrypt) | X | Spring Security BCrypt |
| Routes protégées par Spring Security | X | JWT filter sur toutes les routes privées |
| Séparation des rôles | X | ADMIN / RH / CANDIDAT |
| Protection brute force login | X | failed_attempts + lock_time dans User |
| Secrets détectés dans le dépôt | X | Hook pre-commit "Detect hardcoded secrets" |
| CORS configuré | X | CorsConfig.java présent |

## Points à améliorer en production
- Remplacer Ethereal par Resend
- Restreindre les origines CORS à l'URL Vercel uniquement
