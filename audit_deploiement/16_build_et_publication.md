# 16_build_et_publication.md

## Build backend

### Commande
```bash
mvn clean install -DskipTests
```

### Résultat
- Statut : BUILD SUCCESS

## Build frontend

### Commande
```bash
cd recrutplus-frontend && npm run build
```

### Résultat
- 135 modules transformés
- dist/index.html : 0.47 kB
- dist/assets/index.css : 54.25 kB
- dist/assets/index.js : 379.04 kB
- Durée : 502ms
- Statut : Succès

## Build Docker

### Commande
```bash
make build
```

### Résultat
- Image frontend : projetbachelorrecrutplus-frontend:latest
- Image backend : projetbachelorrecrutplus-backend:latest
- Durée : 61.7s
- Statut : FINISHED
