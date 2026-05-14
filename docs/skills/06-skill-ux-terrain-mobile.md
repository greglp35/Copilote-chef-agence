# Skill 06 — UX terrain mobile

Version : V1.0  
Statut : compétence prioritaire  
Projet : Copilote Chef d’Agence  
Usage : rendre les applications HTML métier utilisables sur le terrain, en agence, dépôt, comptoir ou exploitation.

---

## 1. Objectif

Ce skill sert à concevoir des interfaces simples, rapides et compréhensibles pour des utilisateurs qui travaillent en conditions réelles.

L’utilisateur peut être :

- chef d’agence ;
- responsable exploitation ;
- vendeur comptoir ;
- magasinier ;
- chauffeur ;
- commercial agence.

L’interface doit aider à agir, pas seulement afficher des données.

---

## 2. Règles prioritaires

- Compréhension en moins de 10 secondes.
- Boutons visibles et utiles.
- Pas de doublons d’actions.
- Priorités affichées en haut.
- Statuts simples et explicites.
- Mobile utilisable au doigt.
- Tableaux lisibles ou remplacés par cartes sur petit écran.
- États vides compréhensibles.
- Messages d’erreur humains.
- Impression ou export propre si prévu.

---

## 3. Structure recommandée d’écran

```text
1. Titre + contexte
2. Alerte ou verdict principal
3. KPI utiles
4. Actions prioritaires
5. Filtres simples
6. Liste / cartes / tableau
7. Détail ou justification
8. Export / impression
9. Rappel validation humaine
```

---

## 4. Bons composants terrain

Prévoir :

- cartes de priorité ;
- badges de statut ;
- boutons larges ;
- recherche simple ;
- filtres courts ;
- tri par urgence ;
- affichage “quoi faire maintenant” ;
- justification visible ;
- confirmation avant action sensible ;
- mode impression propre.

---

## 5. Statuts lisibles

Exemples :

```text
OK
À contrôler
À commander
Bloqué
Urgent
Donnée manquante
Validation requise
Action terminée
```

Éviter les statuts trop techniques si l’utilisateur final n’est pas développeur.

---

## 6. Checklist qualité

Avant validation :

- l’action principale est claire ;
- les boutons inutiles ont été supprimés ;
- les termes métier sont compréhensibles ;
- l’affichage mobile est utilisable ;
- la couleur n’est pas le seul indicateur ;
- les erreurs expliquent quoi corriger ;
- les données importantes sont visibles sans scroller trop loin ;
- les exports sont accessibles mais non dangereux ;
- la validation humaine est rappelée.

---

## 7. Anti-patterns à refuser

À éviter :

- trop d’onglets ;
- trop de boutons ;
- tableau géant inutilisable sur mobile ;
- alertes sans action proposée ;
- jargon technique inutile ;
- affichage esthétique mais lent ;
- absence d’état vide ;
- absence de message d’erreur ;
- interface pensée pour développeur au lieu du terrain.

---

## 8. Prompt court pour Codex

```text
Audite cette interface HTML comme un outil terrain mobile pour agence de négoce matériaux. Vérifie compréhension en moins de 10 secondes, boutons utiles, absence de doublons, lisibilité mobile, statuts, filtres, actions prioritaires, erreurs humaines, accessibilité minimale et validation humaine.
```

---

## 9. Verdict attendu

Une interface est acceptable si un utilisateur terrain peut comprendre l’action prioritaire sans explication externe.