# Cockpit Qualité Projet

Statut : validé  
Application : `src/cockpit-qualite-projet.html`  
Fiche JSON : `projets/cockpit-qualite-projet.json`

---

## Objectif

Fournir une page HTML locale, autonome et exploitable pour piloter l’état qualité du dépôt Copilote Chef d’Agence.

Le cockpit permet de visualiser :

- les contrôles actifs ;
- les scripts de recette ;
- les artefacts GitHub Actions ;
- les règles de fusion automatique ;
- les actions prioritaires ;
- une lecture rapide d’un rapport Markdown collé dans la page.

---

## Problème terrain

Le dépôt contient désormais plusieurs contrôles et rapports. Sans vue synthétique, il devient difficile de savoir rapidement quoi vérifier, quel rapport télécharger et quelle décision prendre avant fusion ou diffusion terrain.

---

## Utilisateurs cibles

- Chef d’agence
- Mainteneur IA
- Développeur assistant
- Responsable de validation projet

---

## Règles de sécurité

- Aucun appel réseau.
- Aucun token.
- Aucun mot de passe.
- Aucun identifiant AS400.
- Aucune chaîne ODBC.
- Aucun secret dans le HTML.
- Fonctionnement local/offline.
- Validation humaine obligatoire avant diffusion terrain.

---

## Hors périmètre

- Ne se connecte pas à GitHub.
- Ne lance pas les workflows.
- Ne fusionne aucune PR.
- Ne remplace pas les contrôles GitHub Actions.
- Ne remplace pas la validation humaine terrain.

---

## Validation

Le module est validé comme cockpit local de lecture et d’aide à la décision qualité. Il ne prend pas d’action automatique dans GitHub.