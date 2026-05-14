# Couverture chantier — Vérifier chantier complet

Statut : validé comme référentiel métier  
Application : `src/couverture-chantier.html`  
Fiche JSON : `projets/couverture-chantier.json`

---

## Objectif

Vérifier si un chantier type est réellement vendable aujourd’hui, et non seulement si un article principal est disponible.

Un chantier vendable nécessite :

- produit principal disponible ;
- accessoires obligatoires disponibles ;
- quantité suffisante ;
- zone localisée ;
- préparation possible ;
- validation humaine avant annonce client.

---

## Problème terrain

Le stock mini/maxi classique peut indiquer qu’un article principal est disponible alors qu’un chantier complet n’est pas vendable à cause d’un accessoire, d’une fixation, d’un complément ou d’une localisation manquante.

---

## Utilisateurs cibles

- Chef d’agence
- Responsable exploitation
- Vendeur comptoir
- Magasinier
- Commercial agence

---

## Règles de sécurité

- Aucune donnée sensible dans le HTML.
- Aucun mot de passe ou token.
- Aucun identifiant AS400.
- Aucune chaîne ODBC.
- Aucune requête SQL sensible.
- Aucune écriture ERP directe.
- Validation humaine obligatoire.

---

## Hors périmètre

- Ne pas commander automatiquement.
- Ne pas modifier TFI ou AS400 depuis le HTML.
- Ne pas promettre une disponibilité client sans validation.
- Ne pas couvrir tous les chantiers possibles en V1.

---

## Validation

La logique est validée comme couche de décision métier au-dessus du stock mini/maxi. Le module reste une aide à la décision et ne remplace pas le jugement terrain.