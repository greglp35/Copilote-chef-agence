# Référentiel métier — Couverture chantier

Version : 1.0
Date : 2026-05-12
Projet : Copilote Chef d'Agence — stock mini/maxi, plan parc, préparation commande

## 1. Principe directeur

La logique de stock ne doit pas être pensée article par article, mais chantier par chantier.

Mauvaise logique :

> On stocke un peu de tout.

Bonne logique :

> Pour les chantiers courants, le client doit pouvoir repartir avec un lot complet ou obtenir immédiatement une solution fiable : stock disponible, équivalent, complément, réservation ou délai annoncé.

Formulation métier à retenir :

> Ne pas stocker des articles. Stocker des solutions chantier complètes.

Conséquence directe :

> Article disponible ne veut pas dire chantier vendable.
> Chantier vendable = produit principal + accessoires + quantité suffisante + zone localisée + préparation possible.

## 2. Objectif du module

Créer une notion de couverture chantier afin de répondre à une question concrète :

> Est-ce que l'agence peut vendre aujourd'hui un chantier complet pour une surface ou quantité donnée ?

L'outil doit produire un verdict clair, utilisable par un vendeur, un magasinier ou un chef d'agence.

Exemples de réponses attendues :

- Oui, le chantier est couvert et peut être préparé.
- Le chantier est presque complet, il manque un accessoire non bloquant.
- Le chantier est possible avec complément ou équivalent.
- Le chantier n'est pas couvert car un produit obligatoire est manquant.

## 3. Niveaux de verdict

### CHANTIER_COMPLET

Tous les articles obligatoires sont disponibles en quantité suffisante pour la surface demandée.

Condition métier :

- produits obligatoires disponibles ;
- quantité suffisante ;
- zone ou emplacement exploitable ;
- préparation possible sans action externe immédiate.

### CHANTIER_PRESQUE_COMPLET

Le chantier est vendable avec vigilance, mais il manque un élément secondaire ou une quantité faible sur un article non bloquant.

Condition métier indicative :

- aucun article obligatoire critique manquant ;
- taux de couverture global supérieur ou égal à 90 % ;
- manque limité, explicable et traitable au comptoir.

### CHANTIER_POSSIBLE_AVEC_COMPLEMENT

Le chantier peut être vendu si une solution claire est proposée immédiatement.

Solutions acceptées :

- produit de remplacement validé ;
- complément disponible dans une autre zone ;
- réservation partielle ;
- commande fournisseur ou transfert avec délai annoncé ;
- préparation principale aujourd'hui et complément sous X jours.

### CHANTIER_NON_COUVERT

Le chantier ne doit pas être annoncé comme vendable.

Cas typiques :

- produit obligatoire manquant ;
- accessoire indispensable absent ;
- quantité trop faible ;
- équivalent non défini ;
- délai inconnu ;
- zone/emplacement introuvable.

## 4. Règle mini/maxi enrichie

Pour les produits stratégiques, le mini ne doit pas seulement être basé sur la vente moyenne.

Règle recommandée :

> mini utile = max(mini calculé par rotation, quantité minimale pour couvrir au moins un chantier standard)

Exemple :

- chantier cloison standard = 50 m2 ;
- stock minimum utile = de quoi vendre 50 m2 complet ;
- si le mini actuel ne couvre pas un chantier standard, il doit être signalé comme mini insuffisant métier.

## 5. Chantiers réflexes à prioriser

Il ne faut pas chercher à couvrir tous les chantiers possibles. L'agence doit d'abord choisir ses chantiers réflexes.

Liste de départ recommandée :

- cloison BA13 ;
- isolation laine ;
- terrasse bois ;
- VRD courant ;
- petite maçonnerie ;
- couverture accessoire.

Ces chantiers doivent devenir les références de pilotage stock, plan parc et préparation commande.

## 6. Bouton ou onglet à prévoir dans l'application

Nom recommandé :

> Vérifier chantier complet

Parcours utilisateur :

1. L'utilisateur choisit un type de chantier.
2. Il renseigne une surface ou une quantité.
3. L'application calcule les besoins.
4. L'application compare avec le stock disponible.
5. L'application affiche un verdict.
6. L'application propose une action : préparer, remplacer, compléter, réserver, annoncer délai ou refuser la vente immédiate.

Exemple de sortie :

- Chantier couvert à 92 % ;
- produits disponibles : 8/9 ;
- produit manquant : bande à joint ;
- action recommandée : proposer équivalent validé ou commander complément ;
- verdict : CHANTIER_POSSIBLE_AVEC_COMPLEMENT.

## 7. KPI à intégrer

Indicateurs prioritaires :

- taux de couverture chantier complet ;
- nombre de chantiers standards couverts ;
- produit bloquant le plus fréquent ;
- familles avec accessoires manquants ;
- articles principaux OK mais chantier incomplet ;
- nombre de chantiers complets vendables aujourd'hui.

KPI principal :

> Nombre de chantiers complets vendables aujourd'hui.

Exemples :

- Cloison BA13 50 m2 : 3 chantiers complets disponibles ;
- Terrasse 20 m2 : 1 chantier complet disponible ;
- Isolation combles 100 m2 : incomplet, manque adhésif membrane.

## 8. Intégration dans les modules existants

### Stock mini/maxi

Le module stock doit ajouter une lecture chantier :

- rattacher certains articles à des chantiers types ;
- calculer le nombre de chantiers standards vendables ;
- détecter les articles principaux disponibles mais chantier incomplet ;
- signaler les minis insuffisants pour couvrir un chantier standard.

### Plan parc magasinier

Le plan parc doit aider à préparer le chantier complet :

- afficher les zones des composants du chantier ;
- détecter les familles dispersées ;
- alerter si un produit obligatoire n'a pas de zone fiable ;
- faciliter la préparation d'un lot complet.

### Préparation commandes client

La préparation doit intégrer le verdict chantier :

- vérifier que toutes les lignes obligatoires sont présentes ;
- afficher les manquants avant validation ;
- empêcher une préparation annoncée complète si un article obligatoire manque ;
- proposer remplacement, complément ou délai.

## 9. Garde-fous

Règles bloquantes :

- ne jamais annoncer un chantier complet si un article obligatoire manque ;
- ne pas transformer une recommandation en commande automatique ;
- validation humaine obligatoire ;
- pas d'identifiant AS400, pas de requête SQL sensible, pas de connexion ERP directe dans le HTML ;
- données de test anonymisées dans le dépôt.

## 10. Verdict métier

Cette logique doit devenir une couche de décision au-dessus du stock mini/maxi.

Le mini/maxi dit :

> Est-ce que l'article est bien piloté ?

La couverture chantier dit :

> Est-ce que l'agence peut vendre une solution complète et fiable aujourd'hui ?

C'est cette deuxième question qui crée la confiance client.