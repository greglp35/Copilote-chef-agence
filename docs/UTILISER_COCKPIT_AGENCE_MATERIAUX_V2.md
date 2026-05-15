# Utiliser Cockpit Agence Matériaux V2

Version : V2.0  
Application : `src/cockpit-agence-materiaux-v2.html`

---

## Objectif

Ce module HTML sert à piloter les priorités quotidiennes d’une agence de négoce de matériaux.

Il aide à suivre :

- actions commerciales ;
- alertes stock ;
- livraisons sensibles ;
- points sécurité ;
- actions exploitation ;
- journal local.

---

## Utilisation rapide

1. Ouvrir le fichier HTML dans un navigateur.
2. Lire les KPI du tableau de bord.
3. Traiter d’abord les alertes immédiates.
4. Aller dans `Priorités` pour filtrer, trier et éditer les actions.
5. Ouvrir une ligne en détail si nécessaire.
6. Clôturer les actions traitées.
7. Exporter en CSV ou JSON si besoin.

---

## Données

Les données sont stockées localement dans le navigateur.

Ce fonctionnement est volontaire pour la V2 :

- aucun serveur ;
- aucune connexion distante ;
- aucune dépendance externe ;
- test possible en local.

---

## Points à valider terrain

Avant usage réel :

- tester sur mobile ;
- tester sur tablette ;
- vérifier les libellés métier ;
- vérifier le scoring ;
- tester l’export CSV ;
- tester l’export JSON ;
- tester un import JSON ;
- valider les actions types avec l’équipe.

---

## Limites V2

Ce module ne remplace pas l’ERP ni la validation humaine.

Il sert de cockpit local d’aide à la décision.