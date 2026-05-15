# Hub Applications Métier

Statut : validé  
Application : `src/hub-applications.html`  
Fiche JSON : `projets/hub-applications.json`

---

## Objectif

Fournir un point d’entrée unique pour ouvrir, filtrer et organiser les applications HTML métier du dépôt.

Le hub permet de gérer :

- catalogue des applications ;
- recherche ;
- filtres par catégorie ;
- filtres par rôle ;
- favoris locaux ;
- aperçu intégré ;
- ouverture en nouvel onglet ;
- import/export de configuration.

---

## Problème terrain

Le dépôt contient plusieurs applications HTML. Sans hub, il devient difficile de savoir quelle application ouvrir selon le métier, le rôle ou le besoin du moment.

---

## Utilisateurs cibles

- Chef d’agence
- Comptoir
- Dépôt
- Magasinier
- Responsable exploitation
- Mainteneur projet

---

## Règles de sécurité

- Fonctionnement local/offline.
- Aucune connexion externe.
- Aucune information confidentielle intégrée au HTML.
- Les rôles sont des filtres visuels, pas une sécurité d’accès.
- Validation humaine obligatoire avant diffusion terrain.

---

## Hors périmètre

- Ne remplace pas une authentification.
- Ne protège pas réellement les applications par profil.
- Ne modifie pas les fichiers du dépôt depuis l’interface.
- Ne lance pas de workflow.

---

## Validation

Module validé comme hub local de lancement et d’organisation des applications HTML métier.