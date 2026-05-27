# 21_liste_anomalies.md

## Anomalie 1 — Routing React Router non géré par Nginx
**Contexte :** Pas de config Nginx custom, rechargement de page = 404.
**Impact :** Les liens directs vers des routes React retournaient une 404 en Docker.

## Anomalie 2 — Taille max du champ téléphone non définie
**Contexte :** @Size(min=10) sans max sur le champ phone dans User et Application.
**Impact :** Des valeurs trop longues pouvaient être insérées en base.

## Anomalie 3 — Envoi de mail non fonctionnel en production
**Contexte :** Render free tier bloque les connexions SMTP sortantes (ports 25, 465, 587).
**Impact :** Les emails de confirmation de candidature et de code d'accès ne sont pas envoyés en prod.
