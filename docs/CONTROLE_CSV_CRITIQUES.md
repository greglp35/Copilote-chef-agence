# Contrôle CSV critiques

Version : V1.0  
Projet : Copilote Chef d’Agence

---

## Objectif

Ce contrôle vérifie les fichiers CSV utilisés par le dépôt, en particulier les templates, sources et exports liés aux modules métier.

Il vise à éviter :

- les CSV totalement vides ;
- les en-têtes inutilisables ;
- les colonnes dupliquées ;
- les exports critiques sans colonnes obligatoires ;
- les exports réels sans lignes de données.

---

## Règle progressive

Tous les CSV ne doivent pas être traités de la même manière.

### Bloquant

Le contrôle bloque si :

- le fichier CSV est vide ;
- l’en-tête est vide ou contient une colonne sans nom ;
- des colonnes sont dupliquées ;
- un CSV critique connu ne contient pas ses colonnes obligatoires ;
- un fichier situé dans `exports/` ne contient aucune ligne de données.

### Avertissement

Le contrôle signale sans bloquer si :

- un template CSV n’a qu’un en-tête ;
- une source préparatoire n’a pas encore de lignes de données ;
- un CSV potentiellement critique n’a pas encore de règle dédiée.

---

## CSV critiques connus

Le contrôle applique actuellement des règles dédiées à :

```text
templates/tfi/mapping_tfi_stock_mini_maxi.csv
exports/*export*tfi*.csv
```

---

## Rapport généré

Le contrôle génère :

```text
rapports/controle-csv-critiques.md
```

Le workflow publie ce rapport comme artefact :

```text
rapport-controle-csv-critiques
```

---

## Décision

Un CSV critique n’est pas validé uniquement parce qu’il existe.

Il doit être lisible, structuré, contrôlable et cohérent avec son usage métier.