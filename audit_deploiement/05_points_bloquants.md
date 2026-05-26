# 05_points_bloquants.md

## Point bloquant 1 — Pas de fichier .env.example ou équivalent
**Impact :** Le application.properties réel est ignoré par Git (bonne pratique),
mais aucun fichier exemple n'existe pour qu'un tiers sache quelles variables
configurer pour lancer le projet.
**Action prévue :** Créer un application.properties.example avec les clés
nécessaires sans les valeurs sensibles.

## Point bloquant 2 — README incomplet
**Impact :** Un tiers ne peut pas installer et lancer le projet sans assistance.
**Action prévue :** Compléter le README avec les sections installation, lancement,
variables d'environnement et prérequis.

## Point bloquant 3 — Configuration mail non prévue pour la production
**Impact :** Le projet utilise Ethereal (service de test) pour les mails. En production,
les mails ne seront pas réellement envoyés.
**Action prévue :** Identifier un service SMTP de production (ex: SendGrid, Brevo)
et externaliser la configuration mail dans les variables d'environnement.

## Point bloquant 4 — Pas de profil Spring séparé pour la production
**Impact :** Un seul application.properties pour dev et prod. Risque de déployer
avec des valeurs de dev (logs verbeux, config Ethereal, etc.).
**Action prévue :** Créer un application-prod.properties avec les valeurs
adaptées à la production.

## Point bloquant 5 — Bases de données locales, aucune instance distante prévue pour la prod
**Impact :** MySQL (données applicatives) et MongoDB (stockage CVs via GridFS)
tournent en local uniquement. En production, aucune des deux bases ne sera accessible.
**Action prévue :** Migrer vers des instances cloud (ex: PlanetScale/Railway pour MySQL,
MongoDB Atlas pour MongoDB) et externaliser toutes les URIs de connexion
dans les variables d'environnement.
