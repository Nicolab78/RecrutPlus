# Convention de tagging Docker

## Format

`v{MAJEUR}.{MINEUR}.{PATCH}-{HASH_COMMIT}`

## Exemples

- `v0.1.0` : première version stable
- `v0.1.1` : correctifs de sécurité
- `v0.1.1-ba0eba1` : version avec hash du commit pour la tracabilité

## Règles

- Toujours pousser un tag de version précis, jamais `:latest` seul en prod.
- Le hash du commit permet de retrouver exactement le code source de l'image.
- `latest` pointe toujours vers la dernière version stable.
