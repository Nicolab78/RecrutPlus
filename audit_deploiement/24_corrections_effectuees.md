# 24_corrections_effectuees.md

## Correction 1 — Routing Nginx
- **Fichier modifié :** recrutplus-frontend/nginx.conf (créé)
- **Modification :** Ajout de try_files $uri $uri/ /index.html
- **Résultat :** Navigation React Router fonctionnelle en Docker

## Correction 2 — Taille max téléphone
- **Fichier modifié :** User.java, Application.java
- **Modification :** @Size(min=10, max=15)
- **Résultat :** Validation correcte
