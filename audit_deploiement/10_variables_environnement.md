# 10_variables_environnement.md

## Variables d'environnement du projet

| Variable | Valeur locale (exemple) | Obligatoire |
|---|---|---|
| `spring.datasource.url` | jdbc:mysql://localhost:3306/recrutplus_db | Oui |
| `spring.datasource.username` | root | Oui |
| `spring.datasource.password` | **** | Oui |
| `security.jwt.secret-key` | **** | Oui |
| `security.jwt.expiration-time` | 86400000 | Oui |
| `spring.mail.host` | smtp.ethereal.email | Oui |
| `spring.mail.port` | 587 | Oui |
| `spring.mail.username` | **** | Oui |
| `spring.mail.password` | **** | Oui |
| `app.mail.from` | noreply@recrutplus.com | Oui |
| `app.mail.base-url` | http://localhost:5173 | Oui |
| `spring.data.mongodb.host` | localhost | Oui |
| `spring.data.mongodb.port` | 27017 | Oui |
| `spring.data.mongodb.database` | recrutplus | Oui |

## Fichier exemple
Un fichier `application.properties.example` doit être créé à la racine
du backend avec toutes ces clés sans les valeurs sensibles.
