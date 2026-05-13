# Scénario d’usage — Analyse fournisseur pour stock mini / maxi

Version : V1.0  
Projet : Copilote Chef d’Agence  
Module : Stock Mini / Maxi  
Périmètre : négoce de matériaux de construction  
Statut : scénario fonctionnel pour test, Make, Glide, Google Sheets ou future interface HTML

---

## 1. Objectif du scénario

Ce scénario décrit le flux complet pour transformer une information fournisseur brute en données exploitables pour une application de stock mini / maxi.

L’objectif est de sécuriser la décision de réapprovisionnement en évitant :

- les mini/maxi inventés ;
- les commandes non compatibles avec les conditionnements ;
- les seuils calculés sans délai fiable ;
- les ruptures sur produits stratégiques ;
- les surstocks sur produits lents ou volumineux ;
- les données fournisseur non vérifiées intégrées comme des certitudes.

---

## 2. Entrées possibles

Le scénario peut démarrer à partir de plusieurs sources :

| Source | Exemple | Fiabilité de départ | Point de vigilance |
|---|---|---|---|
| Tarif fournisseur | Fichier Excel ou PDF | Moyenne | Souvent incomplet sur les délais réels |
| Catalogue fournisseur | PDF produit | Faible à moyenne | Très commercial, peu logistique |
| Conditions commerciales | Mail ou document achat | Moyenne à élevée | Vérifier les familles concernées |
| Échange commercial | Mail fournisseur | Moyenne | Demander confirmation écrite |
| Historique commandes | Export ERP / AS400 / TFI | Élevée si propre | Ne jamais exposer de données sensibles dans le HTML |
| Base agence | Google Sheets interne | Variable | Vérifier unités, doublons et références |

---

## 3. Flux fonctionnel cible

```text
1. Collecte des informations fournisseur
       ↓
2. Analyse IA avec le référentiel métier
       ↓
3. Production d'une sortie structurée
       ↓
4. Validation du JSON avec le schéma
       ↓
5. Contrôle des données manquantes
       ↓
6. Mise à jour Google Sheets ou base applicative
       ↓
7. Calcul ou blocage des mini/maxi
       ↓
8. Affichage dans l'application
       ↓
9. Décision humaine : commander, compléter, surveiller ou bloquer
```

---

## 4. Fichiers utilisés

### Référentiel métier

```text
/docs/stock-mini-maxi/REFERENTIEL_ANALYSE_FOURNISSEUR_MINI_MAXI.md
```

Utilisé pour cadrer l’analyse IA.

### Guide du module

```text
/docs/stock-mini-maxi/README_STOCK_MINI_MAXI.md
```

Utilisé pour comprendre l’ensemble du module.

### Schéma JSON

```text
/data/schemas/fournisseur_stock_mini_maxi.schema.json
```

Utilisé pour valider la structure de sortie.

### Exemple de données

```text
/data/examples/exemple_fournisseur_stock_mini_maxi.json
```

Utilisé pour tester le flux sans données sensibles.

### Modèle Google Sheets

```text
/templates/google-sheets/colonnes_fournisseur_stock_mini_maxi.csv
```

Utilisé pour préparer la base tabulaire.

---

## 5. Étape 1 — Collecter les informations fournisseur

### Données minimales à récupérer

| Donnée | Obligatoire | Pourquoi |
|---|---|---|
| Nom fournisseur | Oui | Identification |
| Famille produit | Oui | Regroupement métier |
| Référence fournisseur | Oui | Correspondance achat |
| Désignation | Oui | Lisibilité terrain |
| Délai livraison moyen | Oui | Calcul du mini |
| Délai livraison prudent | Oui | Sécurité rupture |
| Conditionnement | Oui | Quantité de réappro |
| Multiple achat | Oui | Commande réaliste |
| Franco | Recommandé | Optimisation achat |
| Minimum commande | Recommandé | Évite les commandes non valides |
| Produit stocké fournisseur | Recommandé | Fiabilité disponibilité |
| Produit sur commande | Recommandé | Décision stock ou commande spéciale |
| Référence alternative | Recommandé | Substitution en cas de rupture |

---

## 6. Étape 2 — Lancer l’analyse IA

Utiliser le prompt maître présent dans :

```text
/docs/stock-mini-maxi/REFERENTIEL_ANALYSE_FOURNISSEUR_MINI_MAXI.md
```

Le prompt doit recevoir les informations fournisseur brutes dans la variable :

```text
{{informations_fournisseur}}
```

Exemple de données brutes :

```text
Fournisseur : Exemple Isolation Ouest
Famille : isolation
Délai annoncé : 3 à 6 jours
Franco : 900 EUR HT
Commande le lundi et mercredi avant 11h
Livraison mercredi et vendredi
Palette laine de verre : 24 rouleaux
Taux de service non communiqué
Certaines références uniquement sur commande
```

---

## 7. Étape 3 — Sortie attendue de l’analyse

L’analyse IA doit produire :

1. une synthèse fournisseur ;
2. un tableau des données utiles ;
3. des paramètres mini/maxi recommandés ou bloqués ;
4. les risques stock ;
5. les données manquantes à demander ;
6. un JSON structuré.

Point critique :

```text
Si la consommation moyenne est absente, le mini/maxi chiffré doit être bloqué.
```

---

## 8. Étape 4 — Valider le JSON

Comparer la sortie IA au schéma :

```text
/data/schemas/fournisseur_stock_mini_maxi.schema.json
```

Contrôles minimums :

| Contrôle | Résultat attendu |
|---|---|
| Bloc fournisseur présent | Oui |
| Bloc paramètres_stock présent | Oui |
| Bloc risques_stock présent | Oui |
| Bloc donnees_manquantes présent | Oui |
| Bloc recommandations présent | Oui |
| Priorité dans valeurs autorisées | Oui |
| Risque rupture dans valeurs autorisées | Oui |
| Type paramétrage cohérent | Oui |
| Pas de mini/maxi chiffré sans consommation | Oui |

---

## 9. Étape 5 — Contrôler les données manquantes

### Données bloquantes

Une donnée manquante est bloquante si elle empêche une décision fiable.

| Donnée absente | Conséquence |
|---|---|
| Consommation moyenne | Pas de calcul mini/maxi fiable |
| Conditionnement | Pas de réappro réaliste |
| Multiple achat | Risque de commande impossible |
| Délai prudent | Risque de rupture mal évalué |
| Unité achat / stock / vente | Risque d’erreur de quantité |

### Règle d’application

```text
Si une donnée bloquante est absente, afficher une alerte et empêcher le calcul automatique.
```

---

## 10. Étape 6 — Mise à jour Google Sheets

Utiliser les colonnes du fichier :

```text
/templates/google-sheets/colonnes_fournisseur_stock_mini_maxi.csv
```

La feuille doit permettre :

- de filtrer les fournisseurs incomplets ;
- d’identifier les articles sous mini ;
- de repérer les conditionnements absents ;
- de repérer les produits stratégiques ;
- de lister les questions à poser au fournisseur ;
- de suivre les actions correctives.

---

## 11. Étape 7 — Calcul ou blocage mini/maxi

### Cas 1 — Données suffisantes

Si consommation moyenne, délai prudent et conditionnement sont connus :

```text
stock_minimum = consommation pendant délai fournisseur + stock de sécurité
stock_maximum = stock_minimum + quantité de réapprovisionnement compatible conditionnement
seuil_alerte = stock_minimum
```

### Cas 2 — Données insuffisantes

Si consommation moyenne absente :

```text
Calcul mini/maxi impossible sans consommation moyenne.
```

Si conditionnement absent :

```text
Réapprovisionnement à sécuriser : conditionnement fournisseur inconnu.
```

Si délai prudent absent :

```text
Délai fournisseur prudent à confirmer avant calcul.
```

---

## 12. Étape 8 — Affichage dans l’application

L’interface doit afficher des vues simples.

### Vue Fournisseurs

Afficher :

- nom fournisseur ;
- typologie ;
- familles produits ;
- délai moyen ;
- délai prudent ;
- franco ;
- minimum commande ;
- fiabilité ;
- risque rupture ;
- données manquantes.

### Vue Articles

Afficher :

- référence interne ;
- référence fournisseur ;
- désignation ;
- famille ;
- stock disponible ;
- stock mini ;
- stock maxi ;
- conditionnement ;
- multiple achat ;
- priorité ;
- action recommandée.

### Vue Alertes

Afficher :

- sous mini ;
- surstock ;
- donnée critique manquante ;
- mini/maxi incompatible ;
- produit stratégique sans stock suffisant ;
- produit sans référence alternative ;
- fournisseur à risque.

---

## 13. Étape 9 — Décision humaine

Le système ne doit pas commander automatiquement en V1.

La décision finale appartient au chef d’agence ou à la personne responsable des achats.

Actions possibles :

| Action | Quand l’utiliser |
|---|---|
| Commander | Données fiables et stock sous mini |
| Compléter | Données critiques manquantes |
| Surveiller | Produit proche du seuil |
| Bloquer | Mini/maxi incohérent ou risque fort |
| Réduire maxi | Produit lent, cher ou volumineux |
| Passer en commande spéciale | Produit faible rotation ou non stratégique |
| Demander alternative | Produit stratégique à risque rupture |

---

## 14. Exemple de scénario complet

### Situation

Un fournisseur transmet un tarif isolation avec délais, franco et quelques conditionnements.

### Analyse

L’IA identifie :

- délai annoncé 3 à 6 jours ;
- délai prudent retenu 6 jours ;
- franco 900 EUR HT ;
- palettes de 24 rouleaux sur une référence ;
- taux de service absent ;
- certaines références sur commande ;
- consommation moyenne absente pour plusieurs articles.

### Résultat attendu

L’application doit :

- accepter la fiche fournisseur ;
- créer une alerte sur le taux de service absent ;
- autoriser un paramétrage partiel sur les références avec conditionnement ;
- bloquer le calcul mini/maxi sur les références sans consommation moyenne ;
- proposer les questions fournisseur à poser ;
- afficher les produits à qualifier en priorité.

---

## 15. Règles de sécurité et conformité projet

Ne jamais placer dans le HTML :

- identifiant AS400 ;
- mot de passe ;
- token API ;
- chaîne ODBC ;
- requête SQL sensible ;
- données fournisseur confidentielles non anonymisées ;
- prix d’achat sensibles si l’outil est partagé largement.

Les exports d’exemple doivent être fictifs ou anonymisés.

La validation humaine reste obligatoire avant toute décision de commande.

---

## 16. Critères de réussite du scénario

Le scénario est réussi si :

- la sortie IA est conforme au schéma JSON ;
- les données critiques manquantes sont visibles ;
- aucun mini/maxi chiffré n’est généré sans consommation fiable ;
- les quantités de réappro respectent les conditionnements ;
- les produits stratégiques sont priorisés ;
- les produits lents ou volumineux ne sont pas surstockés ;
- l’utilisateur comprend l’action à mener en moins de 10 secondes.

---

## 17. Verdict

Ce scénario permet de tester le module Stock Mini / Maxi sans données sensibles.

Il doit être utilisé avant toute connexion réelle à :

- Google Sheets ;
- Glide ;
- Make ;
- interface HTML ;
- export ERP / AS400 / TFI.

Priorité suivante recommandée : créer une checklist de recette du module pour vérifier que l’application respecte bien les règles métier avant diffusion.
