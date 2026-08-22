# Security Policy

- Aucun secret dans le frontend ou Git.
- Aucun export métier réel ou donnée personnelle dans le dépôt.
- L'UI n'est jamais la frontière d'autorisation.
- Les entrées externes sont validées.
- Les sorties HTML sont échappées ou construites via des API DOM sûres.
- Les dépendances doivent être justifiées et maintenues.

## Secrets

- Local : `.env.local` ou équivalent ignoré par Git.
- CI : secrets du fournisseur CI.
- Production : variables d'environnement côté serveur/hébergeur.

## Incident secret

1. Révoquer ou faire tourner le secret.
2. Examiner l'historique Git si nécessaire.
3. Vérifier les usages/journaux.
4. Documenter la cause et la prévention.
