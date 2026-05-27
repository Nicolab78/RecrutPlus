# 17_plan_mise_en_ligne.md

## Étapes de mise en ligne

### 1. Base de données MySQL (Railway)
- Créer un projet Railway
- Ajouter un service MySQL
- Récupérer l'URL de connexion fournie par Railway
- Injecter les variables dans les paramètres du service backend

### 2. Base de données MongoDB (Atlas)
- Créer un cluster gratuit M0 sur MongoDB Atlas
- Créer un utilisateur de base de données
- Autoriser les IPs (0.0.0.0/0 pour Render)
- Récupérer l'URI de connexion

### 3. Service mail (Resend)
- Créer un compte Resend
- Générer une clé API
- Configurer SPRING_MAIL_HOST=smtp.resend.com
- Configurer SPRING_MAIL_USERNAME=resend
- Configurer SPRING_MAIL_PASSWORD=clé API Resend

### 4. Backend (Render)
- Connecter le dépôt GitHub à Render
- Sélectionner le dossier recrutplus-backend
- Injecter toutes les variables d'environnement
- Vérifier le démarrage et les logs

### 5. Frontend (Vercel)
- Connecter le dépôt GitHub à Vercel
- Sélectionner le dossier recrutplus-frontend
- Définir VITE_API_URL avec l'URL Railway du backend
- Vérifier le déploiement

## Points de vérification
- [ ] MySQL accessible depuis Aiven
- [ ] MongoDB Atlas accessible depuis Render
- [ ] Backend démarré sans erreur
- [ ] Frontend connecté au backend
- [ ] Mails envoyés via Resend
