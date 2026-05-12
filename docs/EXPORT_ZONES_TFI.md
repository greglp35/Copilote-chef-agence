# Export zones articles TFI

## Objectif

Preparer un fichier de controle des zones articles compatible avec TFI.

Dans TFI, la zone article sert a determiner la position en stock de l'article et facilite notamment les editions de stock et les inventaires.

## Regle prioritaire

La zone TFI doit etre stockee et exportee sous la forme :

```text
6 caracteres alphanumeriques
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
010203
AABB01
```

Exemples a ne pas exporter vers TFI :

```text
CR-01-01
DP-02-01
COUR-A
DEPOT-D
```

Les tirets peuvent etre utilises uniquement pour l'affichage humain.

## Fichiers sources

Le script utilise :

```text
data/stock-mini-maxi.example.json
data/zonage-agence.example.json
```

## Fichiers generes

Le workflow `Export Zones TFI` genere :

```text
exports/tfi-zones-articles.csv
exports/tfi-zones-articles.controle.json
exports/tfi-zones-articles.rapport.md
```

## Format CSV

Colonnes generees :

```text
code_article;code_zone_tfi;designation;famille;controle;details
```

La colonne importante pour TFI est :

```text
code_zone_tfi
```

Elle doit toujours contenir exactement 6 caracteres.

## Usage recommande

1. Controler le zonage dans l'application HTML.
2. Exporter l'analyse.
3. Lancer ou verifier le workflow GitHub `Export Zones TFI`.
4. Telecharger l'artifact `export-zones-tfi`.
5. Ouvrir le CSV.
6. Verifier les lignes en erreur ou alerte.
7. Corriger les zones si necessaire.
8. Utiliser le CSV comme support de saisie ou de controle dans TFI.

## Chemin de saisie TFI rappele

La notice TFI indique que la zone article est accessible par :

```text
Menu 13 Articles
-> 8 Stock
-> 2 Modifier
-> Zone de 6 caracteres
```

Elle indique aussi une methode plus rapide par famille :

```text
Menu 87 Fichiers
-> 6 Arborescence famille
-> A Liste des articles
-> E Emplacement
```

## Garde-fou

Ce fichier ne doit pas modifier automatiquement TFI.

Il sert a preparer, controler et fiabiliser une mise a jour humaine ou une future procedure validee.

Avant toute mise a jour reelle :

- verifier un petit echantillon ;
- valider le format dans TFI ;
- noter l'etat initial ;
- faire valider par le responsable concerne ;
- eviter les modifications massives non testees.
