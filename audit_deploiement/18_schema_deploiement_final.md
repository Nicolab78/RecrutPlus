# 18_schema_deploiement_final.md

## Architecture applicative

- Utilisateur -> Vercel (Frontend React/Vite)
- Vercel -> Railway (Backend Spring Boot)
- Railway Backend -> Railway MySQL (données applicatives)
- Railway Backend -> MongoDB Atlas (stockage CVs via GridFS)
- Railway Backend -> Resend (emails sortants)

## Chaîne de déploiement

**Frontend**
1. Push GitHub (feature/deployement)
2. Vercel détecte le push et lance le build Vite
3. Mise en ligne automatique sur Vercel

**Backend**
1. Push GitHub (feature/deployement)
2. Railway détecte le push et lance le build Maven
3. Démarrage Spring Boot avec variables d'environnement injectées
4. Connexion MySQL Railway + MongoDB Atlas

## URLs publiques envisagées
- Frontend : https://recrutplus.vercel.app
- Backend  : https://recrutplus-backend.railway.app
