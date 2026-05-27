# 20_tests_post_deploiement.md

## Environnement de test
Tests réalisés sur l'environnement de production.
- Frontend : https://recrut-plus.vercel.app
- Backend : https://recrutplus.onrender.com
- MySQL : Aiven
- MongoDB : Atlas

## Résultats

| Vérification | OK | KO | Commentaire |
|---|---|---|---|
| L'application s'ouvre | X | | https://recrut-plus.vercel.app |
| Login fonctionne | X | | Testé avec admin et RH |
| Les routes principales répondent | X | | |
| Upload CV fonctionne | X | | MongoDB Atlas/GridFS opérationnel |
| Download CV fonctionne | X | | |
| Envoi de mail fonctionne | | X | Render free tier bloque le SMTP |
| Les données s'affichent correctement | X | | |
| Backend API répond | X | | https://recrutplus.onrender.com |
| Séparation des rôles respectée | X | | ADMIN / RH / CANDIDAT |
