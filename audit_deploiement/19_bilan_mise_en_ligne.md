# 19_bilan_mise_en_ligne.md

## Ce qui est prêt
- Build backend validé (Maven)
- Build frontend validé (Vite)
- Build Docker validé (make build)
- Variables d'environnement identifiées et documentées
- Architecture de déploiement définie
- Plan de mise en ligne rédigé

## Ce qui reste à faire
- Créer le projet Railway et configurer MySQL
- Créer le cluster MongoDB Atlas
- Créer le compte Resend et générer la clé API
- Déployer le backend sur Railway
- Déployer le frontend sur Vercel
- Tester l'application en conditions réelles

## Blocages éventuels
- La configuration MongoDB Atlas nécessite d'autoriser
  les IPs Railway (à récupérer après création du service)
- La variable VITE_API_URL du frontend dépend de l'URL
  Railway générée après déploiement du backend

## Statut
Prêt à déployer — les builds sont validés et l'architecture
est définie. Le déploiement effectif sera réalisé en séance 4.
