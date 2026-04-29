# Contributing

## Stratégie de branches

- `main` : production, protégé.
- `stage` : pré-production, validation avant mise en prod.
- `dev` : intégration des développements en cours.
- `feature/*` : une branche par fonctionnalité, créée depuis `dev`.

## Workflow PR

1. Créer une branche depuis `dev` : `git checkout -b feature/ma-fonctionnalite`
2. Développer et committer (les hooks pre-commit vérifient le style automatiquement)
3. Ouvrir une PR vers `dev`
4. La CI lance les tests automatiquement — vérifier que tout est vert
5. Au moins une review requise avant le merge

## Convention sur les commentaires de review

- `nit:` — détail optionnel, pas bloquant
- `must fix:` — doit être corrigé avant le merge
- Critiquer le code, pas la personne

## Lancer les tests en local

```bash
cd recrutplus-backend
mvn test
```

## Lancer les tests avec couverture

```bash
cd recrutplus-backend
mvn clean verify
```
