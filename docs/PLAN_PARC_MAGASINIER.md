# Plan Parc Magasinier — V1 TFI

## Objectif

Créer une interface simple pour les magasiniers afin de :

- visualiser le parc et les zones de stockage ;
- rechercher une zone TFI ou un article ;
- comprendre les consignes par zone ;
- repérer les articles rattachés à une zone ;
- déclarer une anomalie terrain ;
- exporter les anomalies en CSV ;
- imprimer un plan simple.

## Règle TFI

La zone article TFI reste la référence.

```text
code_zone_tfi = 6 caractères alphanumériques
sans tiret
sans espace
en majuscules
```

Exemples :

```text
CR0101
DP0201
LS0101
SE0101
```

Les tirets sont uniquement un affichage humain :

```text
CR-01-01
DP-02-01
```

## Fichier HTML

```text
src/plan-parc-magasinier.html
```

## Fonctions incluses

- plan SVG interactif ;
- zones cliquables ;
- recherche article / famille / code zone ;
- filtres par type de zone ;
- filtres par statut ;
- fiche zone ;
- liste des articles dans la zone ;
- consignes magasinier ;
- anomalies terrain ;
- sauvegarde locale des anomalies ;
- export CSV des anomalies ;
- export JSON du plan ;
- impression.

## Ce que le module ne fait pas

- il ne modifie pas TFI ;
- il ne remplace pas le plan officiel de sécurité ;
- il ne valide pas seul une réimplantation ;
- il ne remplace pas le jugement terrain.

## Utilisation terrain

1. Ouvrir l'HTML.
2. Chercher un article ou une zone.
3. Cliquer sur la zone.
4. Lire les consignes.
5. Vérifier les articles rattachés.
6. Déclarer une anomalie si besoin.
7. Exporter les anomalies pour traitement.

## Évolution prévue

- import des zones depuis `data/tfi-zones-source.csv` ;
- import des articles depuis `data/tfi-articles-source.csv` ;
- synchronisation avec les exports TFI V4 ;
- affichage des ruptures et sous-mini sur le plan ;
- intégration d'un mode inventaire ;
- génération d'une fiche magasinier imprimable.
