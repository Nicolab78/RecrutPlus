# 13_architecture_deploiement.md

## Architecture applicative
Front-end (React/Vite) -> API REST (Spring Boot) -> MySQL (données)
                                                  -> MongoDB (CVs/GridFS)

## Services externes
- SMTP : Ethereal (dev) / Resend (prod)
- Auth : JWT (interne)

## Chaîne de déploiement envisagée
- Front-end : Vercel
- Back-end  : Render
- MySQL     : Aiven
- MongoDB   : MongoDB Atlas

## Ports locaux
- Frontend : http://localhost:5173 (dev) / http://localhost:80 (Docker)
- Backend  : http://localhost:8080
- MySQL    : localhost:3306
- MongoDB  : localhost:27017
