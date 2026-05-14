# Contrôle exemples métier JSON

Version : V1.0  
Projet : Copilote Chef d’Agence

---

## Objectif

Ce contrôle vérifie les fichiers d’exemple métier au format JSON situés dans `/data`.

Il vise à éviter que les exemples utilisés pour tester ou générer les applications HTML métier deviennent incomplets, incohérents ou inutilisables.

---

## Fichiers contrôlés

Le contrôle scanne les fichiers :

```text
data/*.example.json
```

Les formats actuellement reconnus sont :

```text
stock-mini-maxi.example.json
zonage-agence.example.json
```

---

## Règles bloquantes

Le contrôle bloque si :

- le JSON est invalide ;
- un champ racine obligatoire est manquant ;
- le tableau métier attendu est absent ou vide ;
- une ligne métier ne contient pas les champs essentiels ;
- un champ numérique attendu n’est pas numérique ;
- un `code_zone_tfi` ne respecte pas le format 6 caractères alphanumériques ;
- un stock réservé est supérieur au stock physique ;
- un mini est supérieur au maxi ;
- un `multiple_achat` est inférieur à 1.

---

## Règles progressives

Un fichier `.example.json` non reconnu ne bloque pas encore la recette.

Il génère un avertissement :

```text
fichier .example.json sans règle métier dédiée
```

Une règle dédiée pourra être ajoutée ensuite si ce fichier devient structurant.

---

## Rapport généré

Le contrôle génère :

```text
rapports/controle-exemples-metier-json.md
```

Le workflow publie ce rapport comme artefact :

```text
rapport-controle-exemples-metier-json
```

---

## Décision

Un fichier d’exemple métier doit rester exploitable.

Il n’est pas seulement décoratif : il sert de base de test, de démonstration, de génération et de validation pour les applications HTML métier.