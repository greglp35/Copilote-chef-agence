# Cockpit Agence Matériaux V2

Statut : validé  
Application : `src/cockpit-agence-materiaux-v2.html`  
Fiche JSON : `projets/cockpit-agence-materiaux-v2.json`

---

## Objectif

Fournir une application HTML locale, autonome et exploitable pour piloter les priorités quotidiennes d’une agence de négoce de matériaux.

Le cockpit permet de suivre :

- actions commerciales ;
- alertes stock ;
- livraisons ;
- sécurité ;
- exploitation dépôt ;
- journal local des actions.

---

## Problème terrain

Le chef d’agence doit identifier rapidement les sujets qui méritent son attention : devis à relancer, ruptures potentielles, livraisons sensibles, points sécurité et actions exploitation.

---

## Utilisateurs cibles

- Chef d’agence
- Vendeur comptoir
- Responsable exploitation
- Magasinier
- Commercial agence

---

## Règles de sécurité

- Fonctionnement local/offline.
- Aucune donnée réelle obligatoire.
- Aucune connexion externe.
- Aucune information confidentielle intégrée au HTML.
- Validation humaine obligatoire avant diffusion terrain.

---

## Hors périmètre

- Ne remplace pas l’ERP.
- Ne modifie aucune donnée source externe.
- Ne lance aucune commande fournisseur.
- Ne remplace pas la validation humaine.

---

## Validation

Module validé comme cockpit local V2 pour tester un usage terrain plus abouti : stockage local, export, import, scoring, édition et journalisation.