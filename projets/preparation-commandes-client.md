# Préparation Commandes Client — Localisation et validation

## Objectif

Créer une interface terrain pour suivre une préparation de commande client depuis le début de préparation jusqu'à la localisation de la commande prête et sa validation.

## Problème terrain

Une commande préparée peut être complète mais difficile à retrouver si la zone de dépose n'est pas notée clairement. L'équipe a besoin d'un outil simple pour :

- pointer les articles pris ;
- signaler les manquants ;
- indiquer où la commande prête est déposée ;
- demander validation ;
- exporter ou imprimer une trace.

## Fichier principal

```text
src/preparation-commandes-client.html
```

## Fonctions incluses

- liste des commandes ;
- recherche client / commande / article / zone ;
- statut de commande ;
- progression de préparation ;
- pointage des lignes ;
- statut pris / partiel / manquant ;
- zone de dépose de la commande prête ;
- emplacement de dépose ;
- commentaire de préparation ;
- statut prête validation ;
- validation finale ;
- blocage avec motif ;
- anomalies / réserves ;
- export CSV ;
- export JSON ;
- impression.

## Distinction importante

Il y a deux localisations différentes :

1. La zone article : où l'article doit être pris.
2. La zone de dépose : où la commande prête est déposée.

Exemple :

```text
Article BOI-001 à prendre en CR0101
Commande prête déposée en PR0101 / PREP-A
```

## Règle TFI

```text
code_zone_tfi = 6 caractères alphanumériques
sans tiret
sans espace
```

## Garde-fou

Ce module ne modifie pas TFI automatiquement.

Il sert à guider la préparation et à produire une trace exploitable avant validation humaine.

## Critères de validation

- lisible sur mobile ;
- utilisable par un magasinier ;
- impossible de passer en prête validation si toutes les lignes ne sont pas prises ;
- localisation de dépose obligatoire ;
- export CSV exploitable ;
- impression lisible.

## Prochaines actions

1. Tester trois commandes fictives.
2. Tester le cas article manquant.
3. Tester la validation d'une commande complète.
4. Tester l'export CSV.
5. Ajuster les zones de dépose réelles.
