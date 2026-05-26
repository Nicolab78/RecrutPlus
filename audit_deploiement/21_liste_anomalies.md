# 21_liste_anomalies.md

## Anomalie 1 — Routing React Router non géré par Nginx
**Contexte :** Pas de config Nginx custom, rechargement de page = 404.
**Impact :** Les liens directs vers des routes React retournaient une 404 en Docker.

## Anomalie 2 — Taille max du champ téléphone non définie
**Contexte :** @Size(min=10) sans max sur le champ phone dans User et Application.
**Impact :** Des valeurs trop longues pouvaient être insérées en base.
