# README — Système DMA DJ (Version stabilisée V1)

## Identité du système

- **Nom** : DMA DJ — Copilote Chef d'Agence
- **Version** : V1 stabilisée
- **Etat** : Usage réel — aucune refonte en cours

## Périmètre

Assistant IA dédié au pilotage d'une agence tout-faire matériaux :
- Analyse et suivi d'activité
- Automatisation des tâches récurrentes
- Support décisionnel quotidien

## Structure du dépôt

```
00_Pilotage système/       → Ce fichier — navigation et règles de gouvernance
01_Règles validées/        → Règles métier validées (ne pas modifier sans accord)
02_Clôture versions/       → Historique et clôture des versions système
03_Retours terrain/        → Retours d'usage réel, incidents, observations
04_Backlog V2/             → Idées et évolutions futures (non planifiées)
```

## Règles de gouvernance V1

1. Aucune modification des fichiers `01_` et `02_` sans accord explicite du responsable
2. Les modules métier existants ne sont pas touchés hors demande explicite
3. Les retours terrain s'enregistrent dans `03_Retours terrain/`
4. Les idées V2 s'enregistrent dans `04_Backlog V2/` sans engagement de réalisation
5. En cas de doute, demander avant d'agir

## Usage quotidien (rappel 5 lignes)

1. Formuler la demande métier précise au copilote
2. Valider la réponse avant toute action en production
3. Enregistrer tout incident ou retour utile dans `39_retours_usage_terrain_v1.md`
4. Toute idée d'évolution va dans `40_backlog_v2_dma_dj.md`, pas en prod
5. Ne jamais modifier les règles validées sans décision consciente et tracée
