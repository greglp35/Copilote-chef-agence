# Fiche projet — stock-mini-maxi

Version : V1.0  
Statut : valide  
Responsable validation : Greg  
Date de creation : 2026-05-11  
Derniere mise a jour : 2026-05-11

## 1. Nom du projet

Stock mini/maxi — Assistant de pilotage agence

## 2. Probleme terrain a resoudre

Le pilotage du stock ne doit pas se limiter à constater un stock bas. En agence de négoce matériaux, la vraie difficulté consiste à croiser le stock physique, le stock réservé client, les commandes en cours, la vitesse de vente, le délai fournisseur, le mini, le maxi et les multiples d'achat.

Sans outil simple, le risque est de commander trop tard, trop peu, trop, ou sans respecter les conditionnements. Cela peut créer de la rupture, du surstock, du capital immobilisé et une perte de service client.

## 3. Utilisateur cible

- chef d'agence ;
- responsable exploitation ;
- vendeur comptoir ;
- magasinier ;
- commercial agence.

## 4. Objectif operationnel

> L'outil doit permettre d'analyser rapidement les articles suivis en mini/maxi, afin d'identifier les ruptures potentielles, les commandes recommandées, les incohérences mini/maxi et les situations de surstock avant décision humaine.

## 5. Donnees utilisees

| Donnee | Source | Sensible | Commentaire |
|---|---|---|---|
| code_article | saisie ou import nettoye | non | référence article fictive ou anonymisée |
| designation | saisie ou import nettoye | non | libellé article |
| famille | saisie ou import nettoye | non | famille métier |
| stock_physique | saisie ou import nettoye | non | stock constaté |
| stock_reserve | saisie ou import nettoye | non | réservation client |
| commandes_en_cours | saisie ou import nettoye | non | entrées attendues |
| vente_30j | saisie ou import nettoye | non | volume vendu sur 30 jours |
| vente_90j | saisie ou import nettoye | non | volume vendu sur 90 jours |
| delai_fournisseur_jours | saisie ou import nettoye | non | délai fournisseur moyen |
| mini | saisie ou import nettoye | non | seuil mini |
| maxi | saisie ou import nettoye | non | seuil maxi |
| multiple_achat | saisie ou import nettoye | non | multiple ou conditionnement d'achat |

## 6. Regles de securite

- [x] Aucun mot de passe dans le HTML.
- [x] Aucun token dans le HTML.
- [x] Aucun identifiant système dans le HTML.
- [x] Aucune chaine de connexion dans le HTML.
- [x] Aucune requete de base de données dans le HTML.
- [x] Donnees de test fictives ou anonymisees.
- [x] Validation humaine obligatoire avant diffusion.

## 7. Fonctionnalites attendues

| Priorite | Fonctionnalite | Description | Statut |
|---|---|---|---|
| haute | Tableau articles | Afficher les articles suivis | fait |
| haute | Calcul stock disponible | stock physique - stock réservé | fait |
| haute | Calcul stock projeté | disponible + commandes en cours | fait |
| haute | Statut automatique | OK, sous mini, à commander, surstock, incohérent | fait |
| haute | Quantité recommandée | besoin arrondi au multiple d'achat | fait |
| moyenne | Filtres rapides | filtrer par statut ou famille | fait |
| moyenne | Import JSON | importer un jeu de données nettoyé | fait |
| moyenne | Export JSON | exporter l'analyse | fait |
| moyenne | Impression | imprimer la synthèse | fait |
| moyenne | Sauvegarde locale | conserver le dernier jeu de test | fait |

## 8. Hors perimetre

- Ne pas modifier directement une source métier.
- Ne pas passer automatiquement de commande fournisseur.
- Ne pas remplacer la validation humaine.
- Ne pas utiliser de données sensibles non anonymisées.
- Ne pas intégrer d'accès direct à un système de gestion.

## 9. Critères de réussite

- [x] L'utilisateur comprend l'outil en moins de 10 secondes.
- [x] L'outil fonctionne sur mobile.
- [x] Les données ne sont pas perdues après rafraîchissement si sauvegarde attendue.
- [x] L'export ou l'impression fonctionne si prévu.
- [x] La recette GitHub Actions passe.

## 10. Risques et points fragiles

| Risque | Niveau | Parade |
|---|---|---|
| Croire que la quantité recommandée est une commande automatique | moyen | rappeler que la validation humaine est obligatoire |
| Mini/maxi mal renseignés | élevé | afficher un statut incohérent si mini supérieur au maxi |
| Multiple d'achat absent ou erroné | moyen | appliquer un multiple minimum de 1 et signaler les incohérences |
| Données de vente non représentatives | moyen | croiser ventes 30j et 90j avec prudence |
| Surstock non détecté si maxi trop haut | moyen | afficher stock projeté supérieur au maxi |

## 11. Validation humaine

Nom du validateur : Greg  
Date de validation : 2026-05-11  
Décision : valide  
Commentaire : V1 acceptée comme outil local d'aide à l'analyse, sans action automatique sur le stock.

## 12. Lien avec les fichiers source

Fichier HTML principal : `src/stock-mini-maxi.html`  
Fichier JSON projet : `projets/stock-mini-maxi.json`  
Schéma de données : `data/stock-mini-maxi.schema.json`

## 13. Prochaines actions

1. Tester l'application avec des données fictives.
2. Ajuster les seuils métiers selon les familles produits.
3. Ajouter plus tard un import CSV si nécessaire.
