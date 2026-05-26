# 23_plan_correction.md

| Anomalie | Priorité | Cause possible | Correction prévue | Redéploiement nécessaire |
|---|---|---|---|---|
| Routing Nginx 404 | Bloquante | Pas de config Nginx custom | Ajout nginx.conf avec try_files | Oui |
| Taille max téléphone | Mineure | @Size sans max | @Size(min=10, max=15) | Oui |
