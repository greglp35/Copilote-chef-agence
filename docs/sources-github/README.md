# Dossier intégré — Sources GitHub utiles au projet

Version : 1.0  
Date : 2026-07-18  
Statut : proposition soumise à validation humaine  
Projet : Copilote Chef d'Agence

## 1. Finalité

Ce dossier transforme l'audit GitHub en référentiel directement exploitable dans le projet. Il ne remplace ni les sources métier réelles, ni l'ERP TFI/MTX, ni le classeur Excel SharePoint maître.

Il sert à :

- sélectionner des briques techniques éprouvées ;
- encadrer leur usage ;
- éviter les dépendances ajoutées sans contrôle ;
- organiser les tests, la sécurité et la maintenance ;
- distinguer clairement les outils de production, les outils de recette et les références UX.

## 2. Ordre des sources de vérité

1. ERP TFI/MTX : vérité officielle métier.
2. Documents métier fournis et validés : Excel, PDF, procédures, captures, mails, contraintes internes.
3. Excel SharePoint maître : base centrale d'écriture V1 lorsque le module le prévoit.
4. Code et schémas du dépôt : implémentation contrôlée.
5. Documentation officielle des technologies retenues.
6. Dépôts GitHub tiers : composants techniques, jamais vérité métier.

## 3. Règle de dépendance

La règle projet devient :

> Zéro dépendance non auditée, non figée ou chargée dynamiquement depuis Internet.

Une dépendance peut être admise uniquement si elle est :

- justifiée par un besoin réel ;
- inscrite dans le registre des dépendances approuvées ;
- figée à une version ou un commit précis ;
- conservée localement ou installée pendant la construction ;
- contrôlée par les tests et la revue sécurité ;
- remplaçable sans perdre les données métier.

Les CDN d'exécution sont interdits par défaut pour les applications métier.

## 4. Contenu du dossier

- `DEPENDANCES_APPROUVEES.md` : registre de décision et conditions d'emploi.
- `ARCHITECTURE_CIBLE.md` : architecture cible HTML, données, Excel et SharePoint.
- `PLAN_INTEGRATION.md` : ordre d'intégration par lots et critères de sortie.
- `MATRICE_SELECTION.md` : choix par besoin métier.
- `CHECKLIST_SECURITE_RECETTE.md` : contrôles obligatoires avant diffusion.

## 5. Décisions principales

### Socle prioritaire

- Playwright pour les tests réels dans le navigateur.
- axe-core pour les contrôles automatiques d'accessibilité.
- Ajv pour la validation des données JSON par schéma.
- Papa Parse pour les imports et exports CSV robustes.

### Données locales et fichiers

- Dexie pour IndexedDB lorsque le volume ou la structure dépasse le simple `localStorage`.
- browser-fs-access pour ouvrir et enregistrer des fichiers avec une solution de repli compatible.

### Excel

- ExcelJS est le choix principal pour générer et modifier des classeurs XLSX structurés.
- SheetJS Community Edition reste une option d'import pour formats hétérogènes, uniquement après preuve de besoin.
- Les deux bibliothèques ne doivent pas être ajoutées simultanément sans justification documentée.

### Excel SharePoint

L'écriture directe dans Excel SharePoint n'est pas compatible avec une simple page ouverte en `file://`.

Elle exige au minimum :

- un hébergement HTTPS ;
- une application Microsoft Entra ID ;
- MSAL pour l'authentification ;
- Microsoft Graph ;
- des permissions déléguées validées ;
- aucun secret client dans le HTML ou le JavaScript ;
- une journalisation et une gestion des erreurs de concurrence.

La trajectoire recommandée reste :

- V1 : export contrôlé vers le classeur Excel SharePoint maître ;
- V2 : connexion Microsoft Graph après validation sécurité, gouvernance M365 et recette.

## 6. Principe de validation

Aucune dépendance ou architecture présentée dans ce dossier n'est automatiquement autorisée en production.

Chaque intégration doit faire l'objet de :

1. preuve du besoin ;
2. revue licence et sécurité ;
3. prototype isolé ;
4. tests automatisés ;
5. test métier humain ;
6. décision inscrite dans le journal du projet.

## 7. Résultat attendu

Ce dossier doit permettre à un développeur ou à une IA de produire une application plus fiable sans improviser les choix techniques et sans contourner les contraintes métier, Excel, SharePoint, RGPD ou sécurité.