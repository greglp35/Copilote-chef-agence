# Méthode — Zonage agence

## 1. Principe

Le zonage agence est un référentiel transversal.

Il ne sert pas seulement à dire où se trouve un article. Il sert à structurer :

- le stockage ;
- la préparation commande ;
- la réception ;
- l'expédition ;
- la circulation ;
- la sécurité ;
- les irritants terrain ;
- les futures analyses stock.

## 2. Erreur à éviter

L'erreur serait de réduire le zonage à une simple colonne `emplacement` dans le stock.

Une colonne emplacement est utile, mais insuffisante.

Un vrai zonage doit décrire :

- le type de zone ;
- les familles autorisées ;
- les familles interdites ;
- le niveau de risque ;
- la capacité estimée ;
- les règles de sécurité ;
- le statut de la zone ;
- les contraintes de circulation.

## 3. Structure recommandée

Les zones sont décrites dans :

```text
data/zonage-agence.example.json
```

Le schéma de référence est :

```text
data/zonage-agence.schema.json
```

## 4. Types de zones

Types recommandés :

```text
cour
depot_couvert
libre_service
preparation
reception
expedition
quarantaine
securite
administratif
```

## 5. Niveaux de risque

Niveaux recommandés :

```text
faible
moyen
eleve
bloquant
```

Une zone avec risque `bloquant` ne doit pas être utilisée pour du stockage courant.

## 6. Statuts de zone

Statuts recommandés :

```text
active
a_revoir
saturee
bloquee
archivee
```

## 7. Lien avec le stock mini/maxi

Le module `stock-mini-maxi` peut utiliser le zonage pour :

- vérifier si une famille article est cohérente avec sa zone ;
- repérer les articles dans une zone saturée ;
- prioriser les réimplantations ;
- identifier les risques sécurité ;
- préparer un futur plan de dépôt.

## 8. Règle de sécurité

Une zone de sécurité ne doit jamais devenir une zone de stockage.

Exemples :

- accès pompier ;
- zone EPI ;
- circulation chariot ;
- issue de secours ;
- zone interdite au stockage ;
- zone de manœuvre.

## 9. Processus terrain recommandé

1. Faire un relevé réel des zones.
2. Nommer les zones simplement.
3. Définir les familles autorisées.
4. Définir les familles interdites.
5. Affecter un niveau de risque.
6. Définir une capacité approximative.
7. Contrôler la circulation.
8. Valider humainement avec l'équipe.
9. Intégrer progressivement le zonage dans les outils stock et préparation.

## 10. Décision senior

Le zonage doit rester simple au départ.

Mieux vaut 8 zones bien comprises que 40 zones trop détaillées et jamais tenues à jour.

Le bon objectif V1 :

> rendre visible ce qui est stockable, préparé, temporaire, interdit ou à risque.
