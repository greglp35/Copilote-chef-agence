# Guide utilisateur — Stock mini/maxi

## 1. Objectif de l'outil

Le module **stock-mini-maxi** aide à analyser rapidement un stock suivi avec des seuils mini/maxi.

Il sert à repérer :

- les articles sous mini ;
- les articles à commander ;
- les situations de surstock ;
- les incohérences mini/maxi ;
- les quantités recommandées arrondies au multiple d'achat.

L'outil ne passe aucune commande. Il ne modifie aucune donnée métier. Il sert uniquement d'aide à l'analyse.

## 2. Règle de décision

La quantité recommandée n'est jamais une commande automatique.

Elle doit être vérifiée avec :

- les commandes clients à venir ;
- les arrivages déjà prévus ;
- les contraintes fournisseur ;
- le franco ou minimum de commande ;
- la saisonnalité ;
- la place disponible ;
- les priorités commerciales ;
- le jugement humain.

## 3. Données attendues

Le fichier JSON doit contenir un tableau `items` avec les champs suivants :

| Champ | Rôle |
|---|---|
| code_article | identifiant article fictif ou anonymisé |
| designation | nom de l'article |
| famille | famille produit |
| stock_physique | stock constaté |
| stock_reserve | stock réservé client |
| commandes_en_cours | quantités attendues |
| vente_30j | ventes sur 30 jours |
| vente_90j | ventes sur 90 jours |
| delai_fournisseur_jours | délai fournisseur moyen |
| mini | seuil minimum souhaité |
| maxi | seuil maximum souhaité |
| multiple_achat | conditionnement ou multiple d'achat |
| emplacement | zone ou emplacement dépôt |
| classe | classe A/B/C ou priorité métier |

## 4. Lecture des statuts

### OK

Le stock projeté est compris entre le mini et le maxi.

### Sous mini

Le stock disponible ou projeté est inférieur au mini.

Action attendue : vérifier rapidement si une commande est nécessaire.

### À commander

Le stock projeté passe sous le mini mais la situation n'est pas forcément urgente.

Action attendue : analyser le besoin et l'arrondi au multiple d'achat.

### Surstock

Le stock projeté dépasse le maxi.

Action attendue : éviter de recommander sans justification.

### Incompatible

Les paramètres mini/maxi ou multiple d'achat ne sont pas cohérents.

Action attendue : corriger les paramètres avant toute décision.

## 5. Comment utiliser l'outil

1. Ouvrir `src/stock-mini-maxi.html`.
2. Charger les données d'exemple ou importer un JSON propre.
3. Filtrer par statut ou famille.
4. Lire les quantités recommandées.
5. Vérifier les articles prioritaires.
6. Exporter l'analyse si besoin.
7. Imprimer la synthèse pour revue terrain.
8. Valider humainement avant toute action.

## 6. Import JSON

Le fichier importé peut être :

```json
{
  "items": []
}
```

ou directement :

```json
[]
```

Le format recommandé est le premier, car il permet d'ajouter des métadonnées.

## 7. Limites connues

L'outil ne sait pas encore :

- lire un CSV directement ;
- interroger un système externe ;
- connaître les contraintes fournisseur réelles ;
- tenir compte du franco ;
- détecter automatiquement les ventes exceptionnelles ;
- corriger un historique de ventes faussé par les ruptures.

## 8. Bon usage métier

Un bon seuil mini/maxi doit tenir compte :

- de la rotation réelle ;
- du délai fournisseur ;
- du conditionnement ;
- de l'importance client ;
- de la saisonnalité ;
- de la place disponible ;
- du risque de rupture ;
- du risque de surstock.

## 9. Validation humaine obligatoire

Avant d'utiliser une recommandation, vérifier :

- si le stock physique est fiable ;
- si les réservations sont à jour ;
- si les commandes en cours sont réelles ;
- si le multiple d'achat est correct ;
- si l'article est stratégique ou dormant ;
- si la recommandation a du sens commercialement.
