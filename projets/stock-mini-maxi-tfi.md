# Stock mini/maxi TFI — Export zones articles

## Objectif

Contrôler les articles, les zones TFI et les exports CSV sans créer de connexion directe avec TFI.

## Règle TFI

```text
code_zone_tfi = 6 caractères alphanumériques
sans tiret
sans espace
en majuscules
```

Exemples :

```text
DP0101
CR0101
LS0101
```

## Fichier principal

```text
src/stock-mini-maxi-tfi.html
```

## Fonctions incluses

- analyse stock mini/maxi ;
- contrôle du code zone TFI ;
- affichage humain avec tirets ;
- stockage et export sans tirets ;
- filtre par zone TFI ;
- filtre par statut stock ;
- filtre par statut zonage ;
- export CSV TFI ;
- export JSON d'analyse ;
- sauvegarde locale ;
- impression.

## Garde-fou

Ce module ne modifie pas TFI automatiquement.

Il prépare un CSV de contrôle destiné à une validation humaine avant saisie ou import.

## Sécurité

- aucun mot de passe dans le HTML ;
- aucun token dans le HTML ;
- aucun identifiant AS400 ;
- aucune chaîne ODBC ;
- aucune requête SQL sensible ;
- données de démonstration uniquement ;
- validation humaine obligatoire.

## Prochaines actions

1. Tester avec les données d'exemple.
2. Importer un vrai fichier propre.
3. Comparer le CSV exporté avec la saisie TFI sur quelques articles.
4. Généraliser seulement après validation.
