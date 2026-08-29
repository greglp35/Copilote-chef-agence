# Plan d'intégration technique

Version : 1.0  
Principe : intégrer par petits lots testables, sans casser les applications existantes.

## Lot 0 — Verrouillage documentaire

Objectif : figer les règles avant toute dépendance.

Livrables :

- registre des dépendances approuvées ;
- architecture cible ;
- matrice de sélection ;
- checklist sécurité et recette ;
- décision sur le module pilote.

Critère de sortie : validation humaine du présent dossier.

## Lot 1 — Renforcement de la recette navigateur

Objectif : remplacer les contrôles uniquement textuels par des preuves d'exécution.

Actions :

1. Installer Playwright en dépendance de développement.
2. Tester au minimum Chromium, Firefox et WebKit.
3. Ajouter des scénarios pour : import, création, modification, suppression contrôlée, sauvegarde, restauration et export.
4. Enregistrer trace, capture et journal console lors d'un échec.
5. Interdire les erreurs JavaScript non traitées.

Critère de sortie : scénarios critiques verts sur les trois moteurs.

## Lot 2 — Validation des données

Objectif : rendre les imports prévisibles et bloquer les données incohérentes.

Actions :

1. Installer Ajv.
2. Versionner les JSON Schema par module.
3. Installer Papa Parse.
4. Ajouter une prévisualisation CSV avant validation.
5. Détecter séparateur, encodage, colonnes absentes, doublons et formules dangereuses.
6. Produire un rapport d'import exploitable.

Critère de sortie : aucun import ne modifie l'état sans prévisualisation et confirmation.

## Lot 3 — Accessibilité et qualité mesurée

Objectif : compléter les heuristiques actuelles.

Actions :

1. Intégrer axe-core aux tests Playwright.
2. Ajouter Lighthouse CI sur serveur local contrôlé.
3. Définir des budgets de performance adaptés aux postes agence.
4. Tester clavier, focus, zoom 200 %, messages d'erreur et impression.

Critère de sortie : aucune violation critique automatique et checklist humaine signée.

## Lot 4 — Fichiers et persistance locale

Objectif : fiabiliser sauvegarde, reprise et gros volumes.

Actions :

1. Évaluer `localStorage` par rapport au volume réel.
2. Introduire Dexie uniquement lorsque nécessaire.
3. Prévoir migrations et export JSON de secours.
4. Introduire browser-fs-access pour ouverture/enregistrement avec solution de repli.
5. Tester la fermeture brutale et la restauration.

Critère de sortie : aucune perte silencieuse sur les scénarios testés.

## Lot 5 — Excel structuré

Objectif : produire un classeur conforme au modèle métier.

Actions :

1. Choisir un classeur Excel maître réel comme source de test autorisée.
2. Documenter feuilles, tables nommées, colonnes, types et statuts.
3. Introduire ExcelJS dans un prototype isolé.
4. Vérifier lecture, ajout, mise à jour, styles, dates, nombres et formules.
5. Comparer le fichier généré dans Excel Microsoft 365.
6. Refuser toute modification de structure non validée.

Critère de sortie : aller-retour test sans perte de données ni altération du classeur.

## Lot 6 — Modules spécialisés

Tabulator, FullCalendar, SortableJS, interact.js, pdf-lib ou QR ne sont intégrés qu'après validation d'un besoin précis et d'un prototype isolé.

Critère de sortie : gain UX ou métier démontré, accessibilité préservée et poids maîtrisé.

## Lot 7 — Connexion Microsoft Graph V2

Préconditions :

- hébergement HTTPS validé ;
- gouvernance M365 et RGPD validée ;
- application Entra ID créée ;
- permissions minimales approuvées ;
- journal d'audit défini ;
- procédure de révocation disponible.

Actions :

1. Prototype MSAL séparé.
2. Lecture seule d'un classeur de test.
3. Écriture dans une table de test.
4. Gestion des conflits, délais et erreurs Graph.
5. Revue sécurité.
6. Pilote métier limité.

Critère de sortie : validation explicite avant connexion au classeur maître.

## Ordre interdit

Ne pas commencer par Microsoft Graph, une bibliothèque de grille ou un framework UI avant d'avoir stabilisé les schémas, les tests et le flux Excel V1.