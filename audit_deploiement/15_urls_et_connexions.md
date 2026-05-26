# 15_urls_et_connexions.md

## URLs locales
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| MySQL | localhost:3306 |
| MongoDB | localhost:27017 |

## URLs de production envisagées
| Service | URL |
|---|---|
| Frontend | https://recrutplus.vercel.app |
| Backend API | https://recrutplus-backend.railway.app |
| MySQL | Fourni par Railway |
| MongoDB | Fourni par MongoDB Atlas |

## Endpoints critiques backend
| Route | Méthode | Description |
|---|---|---|
| /api/auth/login | POST | Authentification |
| /api/auth/register | POST | Inscription |
| /api/job-offers | GET | Liste des offres |
| /api/applications | POST | Soumettre une candidature |
| /api/documents | POST | Upload CV |
| /api/interviews | GET | Liste des entretiens |
