# Bruno — standard API optionnel

À utiliser uniquement si le projet expose ou consomme une API qui mérite des tests reproductibles.

Pour les nouvelles collections, le format OpenCollection YAML est privilégié.

## Installation CLI

```bash
npm install -g @usebruno/cli
```

## Exécution

```bash
cd bruno
bru run --env-file environments/local.example.json --sandbox=safe
```

Ne jamais committer de token dans les environnements.
