# Skill 01 — HTML métier autonome

Version : V1.0  
Statut : compétence prioritaire  
Projet : Copilote Chef d’Agence  
Usage : créer, auditer et corriger des applications HTML métier locales, simples, robustes et exploitables en agence.

---

## 1. Objectif

Ce skill sert à produire des applications HTML métier autonomes pour le terrain : chef d’agence, comptoir, exploitation, dépôt, stock, commandes, livraisons et sécurité.

L’objectif n’est pas de faire une démonstration technique. L’objectif est de créer un outil qui fonctionne simplement, sans serveur, sans framework inutile et sans dépendance externe.

---

## 2. Règles prioritaires

- Un fichier HTML doit pouvoir fonctionner localement.
- Aucune dépendance externe par défaut.
- Pas de CDN.
- Pas de Google Fonts.
- Pas d’icônes distantes.
- Pas de requête réseau cachée.
- Pas de secret dans le HTML.
- Pas de connexion directe AS400 / TFI / ERP.
- Import/export JSON ou CSV si nécessaire.
- Sauvegarde locale si utile.
- Validation humaine obligatoire pour toute décision critique.

---

## 3. Compétences incluses

Le skill HTML métier couvre :

- structure HTML sémantique ;
- CSS responsive ;
- JavaScript natif ;
- gestion d’état locale ;
- localStorage ou IndexedDB si nécessaire ;
- import JSON ;
- export JSON / CSV ;
- impression ;
- messages d’erreur lisibles ;
- accessibilité minimale ;
- interface mobile ;
- dégradation propre si une fonction n’est pas disponible.

---

## 4. Structure minimale attendue

Une application HTML métier doit contenir :

```text
<header> : identité, titre, contexte, avertissement sécurité
<main>   : contenu métier principal
<section> synthèse / alertes / actions prioritaires
<section> filtres / imports / exports
<section> tableau ou cartes métier
<footer> version, limites, rappel validation humaine
```

---

## 5. Checklist qualité

Avant validation :

- le besoin métier est compréhensible en moins de 10 secondes ;
- les boutons sont utiles et non redondants ;
- l’application fonctionne sur mobile ;
- les erreurs sont affichées clairement ;
- l’import refuse les données incohérentes ;
- l’export contient uniquement des données contrôlées ;
- les données sensibles sont absentes ;
- la validation humaine est visible ;
- l’impression est propre si prévue ;
- aucun appel externe n’est nécessaire.

---

## 6. Anti-patterns à refuser

À éviter :

- interface jolie mais inutilisable ;
- trop d’onglets ;
- boutons doublons ;
- logique métier cachée ;
- données sensibles dans le code ;
- dépendances externes inutiles ;
- actions automatiques sans validation ;
- export non traçable ;
- application qui ne fonctionne que sur grand écran.

---

## 7. Prompt court pour Codex

```text
Audite ce fichier HTML comme une application métier terrain pour négoce matériaux. Vérifie : autonomie locale, zéro dépendance externe, sécurité, UX mobile, import/export, lisibilité, validation humaine, absence de secrets, simplicité des actions et robustesse JavaScript. Propose les corrections prioritaires sans ajouter de framework.
```

---

## 8. Verdict attendu

Un module HTML métier est acceptable s’il est :

- utile ;
- simple ;
- robuste ;
- local ;
- sécurisé ;
- mobile ;
- traçable ;
- compréhensible par un utilisateur terrain.