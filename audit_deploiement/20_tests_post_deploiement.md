# 20_tests_post_deploiement.md

## Environnement de test
Tests réalisés en local via Docker (make up).
Conteneurs : frontend (Nginx), backend (Spring Boot), MySQL, MongoDB.

## Résultats

| Vérification | OK | KO | Commentaire |
|---|---|---|---|
| L'application s'ouvre | X| | http://localhost:80 |
| Login fonctionne | X| | Testé avec admin, RH et candidat |
| Les routes principales répondent | X | | |
| Upload CV fonctionne | X| | MongoDB/GridFS opérationnel |
| Download CV fonctionne | X| | |
| Envoi de mail fonctionne | X| | Ethereal |
| Les données s'affichent correctement | X| | |
| Backend API répond | X| | http://localhost:8080 |
| Séparation des rôles respectée | X| | ADMIN / RH / CANDIDAT |
