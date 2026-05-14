# Skill 03 — Stock mini/maxi négoce matériaux

Version : V1.0  
Statut : compétence métier prioritaire  
Projet : Copilote Chef d’Agence  
Usage : piloter les seuils, alertes, réapprovisionnements et incohérences de stock en agence.

---

## 1. Objectif

Ce skill sert à construire une logique de stock mini/maxi adaptée au négoce de matériaux.

L’objectif n’est pas seulement de dire qu’un article est bas en stock. L’objectif est de croiser :

- stock physique ;
- stock réservé client ;
- commandes fournisseurs en cours ;
- consommation 30 jours ;
- consommation 90 jours ;
- délai fournisseur ;
- mini ;
- maxi ;
- multiple d’achat ;
- conditionnement ;
- priorité produit ;
- risque de rupture ;
- contrainte de stockage.

---

## 2. Règles prioritaires

- Ne jamais inventer un mini ou un maxi sans consommation fiable.
- Ne jamais recommander une quantité sans tenir compte du multiple d’achat.
- Ne jamais ignorer le conditionnement fournisseur.
- Toujours distinguer stock physique, stock disponible et stock projeté.
- Toujours signaler les données critiques manquantes.
- Toujours prévoir une validation humaine avant commande ou modification ERP.

---

## 3. Formules de base

```text
stock_disponible = stock_physique - stock_reserve_client
stock_projete = stock_disponible + commandes_fournisseurs_en_cours
vente_moyenne_jour = ventes_90j / 90
besoin_pendant_delai = vente_moyenne_jour × delai_fournisseur_prudent
stock_minimum = besoin_pendant_delai + stock_securite
stock_maximum = stock_minimum + quantite_reappro_optimale
besoin_brut = stock_maximum - stock_projete
quantite_reappro = besoin_brut arrondi au multiple d’achat supérieur
```

---

## 4. Statuts recommandés

```text
OK
SOUS_MINI
A_COMMANDER
SURSTOCK
INCOMPATIBLE
DONNEE_CRITIQUE_MANQUANTE
MINI_MAXI_INCOHERENT
CONDITIONNEMENT_INCONNU
COMMANDE_A_VALIDER
PRODUIT_STRATEGIQUE
PRODUIT_LENT
```

---

## 5. Contrôles métier obligatoires

Avant de recommander une action :

- mini inférieur ou égal au maxi ;
- multiple d’achat supérieur à zéro ;
- conditionnement connu si commande recommandée ;
- délai fournisseur prudent renseigné ;
- consommation représentative ;
- stock disponible calculé correctement ;
- stock projeté non confondu avec stock physique ;
- dépassement maxi identifié après commande ;
- produit stratégique priorisé ;
- produit lent limité.

---

## 6. Alertes utiles

### Critique

- produit stratégique sous mini ;
- délai fournisseur long et stock insuffisant ;
- mini/maxi incohérent ;
- consommation absente mais mini/maxi chiffré ;
- conditionnement absent sur article à forte rotation.

### Haute

- article sous mini ;
- commande urgente mais franco non atteint ;
- multiple d’achat incompatible avec maxi ;
- fournisseur peu fiable ;
- historique de rupture.

### Moyenne

- article proche du mini ;
- donnée fournisseur partielle ;
- référence alternative absente ;
- taux de service inconnu.

---

## 7. Checklist qualité

Avant validation :

- les formules sont visibles ou documentées ;
- les seuils sont justifiés ;
- les multiples sont respectés ;
- les incohérences bloquent la recommandation ;
- l’utilisateur comprend quoi faire maintenant ;
- les exports distinguent proposition et décision validée ;
- les données manquantes sont affichées ;
- la validation humaine est obligatoire.

---

## 8. Anti-patterns à refuser

À éviter :

- calculer un mini/maxi sans consommation ;
- commander jusqu’au maxi sans tenir compte du conditionnement ;
- ignorer les commandes en cours ;
- ignorer le stock réservé client ;
- confondre surstock et stock de sécurité ;
- afficher une quantité recommandée comme une commande automatique ;
- ne pas distinguer article stratégique et article lent.

---

## 9. Prompt court pour Codex

```text
Audite cette logique stock mini/maxi pour un négoce de matériaux. Vérifie stock disponible, stock projeté, consommation 30/90j, délai fournisseur, mini, maxi, multiple d’achat, conditionnement, surstock, rupture, données manquantes et validation humaine. Corrige les failles métier avant l’interface.
```

---

## 10. Verdict attendu

Une logique stock mini/maxi est acceptable si elle aide à décider sans remplacer le responsable humain.