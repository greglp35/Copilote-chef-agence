# Processus TFI V4 — Zonage articles

## Objectif

Repartir sur une base propre pour préparer les zones articles TFI sans liaison directe dangereuse avec l'ERP.

Le processus V4 repose sur deux fichiers sources simples, modifiables dans Google Sheets ou Excel, puis contrôlés par GitHub Actions.

## Règle centrale

```text
code_zone_tfi = 6 caractères alphanumériques
sans tiret
sans espace
en majuscules
```

Exemples valides :

```text
CR0101
DP0201
LS0101
SE0101
```

Les tirets sont autorisés uniquement dans la colonne d'affichage :

```text
CR-01-01
DP-02-01
```

## Fichiers sources

```text
data/tfi-zones-source.csv
data/tfi-articles-source.csv
```

### tfi-zones-source.csv

Référentiel des zones utilisées par l'agence.

Colonnes principales :

```text
code_zone_tfi
code_zone_affiche
nom_zone
type_zone
familles_autorisees
familles_interdites
niveau_risque
statut_zone
```

### tfi-articles-source.csv

Liste des articles à contrôler ou à préparer pour TFI.

Colonnes principales :

```text
code_article
designation
famille
code_zone_tfi
stock_physique
stock_reserve
commandes_en_cours
vente_30j
vente_90j
mini
maxi
multiple_achat
```

## Workflow GitHub

Workflow :

```text
TFI V4 Controle Export
```

Fichier :

```text
.github/workflows/tfi-v4-controle-export.yml
```

Il lance :

```text
scripts/build_tfi_exports_v4.py
```

## Exports générés

```text
exports/tfi-v4/zones-tfi-controle.csv
exports/tfi-v4/articles-zones-tfi-export.csv
exports/tfi-v4/stock-zonage-analyse.csv
exports/tfi-v4/rapport-controle-tfi-v4.json
exports/tfi-v4/rapport-controle-tfi-v4.md
```

Le fichier le plus utile pour préparer TFI est :

```text
exports/tfi-v4/articles-zones-tfi-export.csv
```

Colonnes :

```text
code_article;code_zone_tfi;designation;famille;controle;details
```

## Garde-fou

Ce flux ne modifie pas TFI automatiquement.

Il sert à :

1. préparer les données ;
2. contrôler les erreurs ;
3. générer un CSV propre ;
4. valider humainement ;
5. saisir ou importer dans TFI selon la procédure validée.

## Méthode terrain recommandée

1. Mettre à jour `data/tfi-zones-source.csv`.
2. Mettre à jour `data/tfi-articles-source.csv`.
3. Lancer le workflow TFI V4.
4. Télécharger l'artifact `tfi-v4-exports`.
5. Lire le rapport Markdown.
6. Corriger les lignes en erreur.
7. Tester sur quelques articles dans TFI.
8. Généraliser seulement après validation.

## Décision de référence

La source propre V4 remplace les anciens essais basés sur :

```text
code_zone_erp
code_zone_normalise
CR-01-01 comme valeur principale
```

À partir de la V4, la seule valeur de référence est :

```text
code_zone_tfi
```
