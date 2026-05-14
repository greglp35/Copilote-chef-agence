# Pilotage stock chantier — Hub agence

Statut : validé  
Application : `src/pilotage-stock-chantier.html`  
Fiche JSON : `projets/pilotage-stock-chantier.json`

---

## Objectif

Fournir un hub local pour passer du pilotage article au pilotage chantier complet.

Le module relie :

- stock mini/maxi ;
- couverture chantier ;
- plan parc magasinier ;
- préparation commandes client.

---

## Problème terrain

Un article disponible ne garantit pas qu’un chantier complet soit vendable. Le chef d’agence et l’équipe doivent pouvoir accéder rapidement aux bons modules pour vérifier le stock, la couverture chantier, la localisation et la préparation.

---

## Utilisateurs cibles

- Chef d’agence
- Responsable exploitation
- Vendeur comptoir
- Magasinier
- Commercial agence

---

## Règles de sécurité

- Aucun mot de passe dans le HTML.
- Aucun token.
- Aucun identifiant AS400.
- Aucune chaîne ODBC.
- Aucune requête SQL sensible.
- Données fictives ou anonymisées uniquement.
- Validation humaine obligatoire avant diffusion ou décision terrain.

---

## Hors périmètre

- Pas de connexion ERP.
- Pas d’écriture TFI.
- Pas d’automatisation de commande.
- Pas de promesse client automatique.

---

## Validation

Le module est validé comme hub de navigation local. Il ne remplace pas les modules métier, il les relie.