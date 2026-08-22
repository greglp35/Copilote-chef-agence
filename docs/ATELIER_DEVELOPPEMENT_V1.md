# Atelier de développement — Baseline V1

## Décision

Le socle de développement commun est :

```text
VS Code
  -> tests locaux
  -> Git / GitHub
  -> Pull Request
  -> contrôles qualité / sécurité
  -> publication seulement lorsqu'un accès distant est nécessaire
```

Vercel n'est pas une dépendance du développement local. Il peut être utilisé au moment de la publication lorsqu'il répond réellement au besoin d'hébergement ou de backend.

## P0 — commun à tout projet actif

- dépôt Git distinct ;
- branche de travail, pas de modification directe de `main` pour les changements sensibles ;
- `.gitignore` adapté au projet ;
- `.editorconfig` ;
- aucun secret ni donnée métier réelle non anonymisée ;
- README décrivant l'état réel du projet ;
- tests locaux quand ils existent ;
- Pull Request avant fusion sur les projets critiques ;
- rollback identifié pour les changements sensibles.

## P1 — selon le projet

- GitHub Actions ;
- Dependabot pour les écosystèmes réellement utilisés ;
- Playwright pour les parcours navigateur ;
- tests Android locaux via ADB pour PWA / caméra / scanner ;
- Gitleaks ou contrôle équivalent des secrets ;
- règles de protection de `main` avec PR + status checks quand des checks fiables existent.

## P2 — uniquement si justifié

- Lighthouse CI ;
- axe-core automatisé ;
- CodeQL selon éligibilité ;
- Dev Containers ;
- Docker ;
- services locaux multiples.

## Règles de simplicité

Ne pas ajouter un outil parce qu'il existe. Chaque dépendance doit réduire un risque, améliorer une preuve ou diminuer une charge récurrente.

Ne pas imposer Docker à une page HTML simple. Ne pas imposer Node à un dépôt documentaire. Ne pas créer un déploiement public simplement pour tester une application qui fonctionne localement.

## Tests mobiles sans publication

Pour une application terrain, préférer en développement :

```text
PC / localhost
  -> câble USB
  -> adb reverse
  -> Android / localhost
```

Cela permet de tester le vrai terminal avant tout déploiement public.

## Sécurité

- fichiers `.env` réels exclus de Git ;
- `.env.example` sans secret ;
- frontend sans secret ;
- données d'essai synthétiques/anonymisées ;
- validation des entrées non fiables ;
- dépendances externes limitées ;
- revue du diff avant push.

## Baseline des dépôts au 2026-08-22

| Dépôt | Profil | Action atelier |
|---|---|---|
| `aji-planning-pro-v4-multisite` | application mature | conserver gates existants, ajouter conventions et maintenance dépendances |
| `zonage-AJI` | PWA/API mature | conserver CI staging et intégrité, ajouter conventions ; prévoir gate PR générique |
| `CRM` | bootstrap métier sensible | sécurité/confidentialité d'abord, ne pas imposer la stack |
| `erp-artisan-btp` | bootstrap vide | baseline neutre avant architecture |
| `aji-hub` | HTML statique public | socle léger + durcissement DOM/URL séparé |
| `Copilote-chef-agence` | référentiel/gouvernance | préserver les workflows spécialisés |
| `reappro` | bootstrap quasi vide | baseline légère avant développement |
| `agent-metier-negoce` | dépôt vide | attendre le premier commit plutôt que forcer `main` |

## Publication

Aucune fusion de baseline ne signifie automatiquement un déploiement. Le choix d'hébergement est une décision distincte du développement et doit rester explicite.
