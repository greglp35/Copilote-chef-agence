# Contrôles HTML qualité

Version : V1.0  
Projet : Copilote Chef d’Agence

---

## Objectif

Ce document décrit les contrôles HTML légers ajoutés à la recette complète.

L’objectif est d’améliorer la qualité minimale des applications HTML métier sans bloquer brutalement le dépôt sur des améliorations progressives.

---

## Contrôles bloquants

Les points suivants bloquent la recette :

- absence de `<title>` ;
- plusieurs `<title>` ;
- `<title>` vide ou trop court ;
- absence de `<h1>` ;
- plusieurs `<h1>` ;
- image sans attribut `alt`.

---

## Contrôles en avertissement

Les points suivants sont signalés mais ne bloquent pas encore :

- meta description absente ou trop courte ;
- meta viewport absente ;
- module critique sans mention explicite de validation humaine.

---

## Raison du choix

La meta description est utile pour la qualité et la lisibilité du projet, mais elle ne doit pas bloquer immédiatement des outils HTML existants.

Le contrôle est donc progressif :

```text
Phase 1 : avertissement
Phase 2 : correction progressive des HTML
Phase 3 : passage éventuel en contrôle bloquant
```

---

## Règle de décision

Un contrôle devient bloquant uniquement si :

- il protège l’utilisateur ;
- il évite une erreur fonctionnelle ou d’accessibilité importante ;
- il ne casse pas inutilement les modules existants ;
- il est couvert par un test de non-régression.
