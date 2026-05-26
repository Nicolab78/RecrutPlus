# 14_variables_production.md

| Variable | Valeur locale | Valeur production attendue | Obligatoire |
|---|---|---|---|
| `SPRING_DATASOURCE_URL` | jdbc:mysql://localhost:3306/recrutplus_db | URL MySQL Railway | Oui |
| `SPRING_DATASOURCE_USERNAME` | root | Utilisateur Railway | Oui |
| `SPRING_DATASOURCE_PASSWORD` | **** | Mot de passe Railway | Oui |
| `SECURITY_JWT_SECRET_KEY` | **** | Clé secrète forte (256 bits) | Oui |
| `SPRING_DATA_MONGODB_HOST` | localhost | URI MongoDB Atlas | Oui |
| `SPRING_DATA_MONGODB_DATABASE` | recrutplus | recrutplus | Oui |
| `SPRING_MAIL_HOST` | smtp.ethereal.email | smtp.resend.com | Oui |
| `SPRING_MAIL_USERNAME` | **** | Clé API Resend | Oui |
| `SPRING_MAIL_PASSWORD` | **** | Clé API Resend | Oui |
| `APP_MAIL_BASE_URL` | http://localhost:5173 | URL Vercel production | Oui |
| `MYSQL_ROOT_PASSWORD` | **** | Géré par Railway | Oui |
