# Module Stock Mini / Maxi — Guide d’utilisation

Version : V1.0  
Projet : Copilote Chef d’Agence  
Périmètre : négoce de matériaux de construction  
Statut : guide de liaison entre référentiel métier, schéma JSON et modèle Google Sheets

---

## 1. Objectif du module

Le module Stock Mini / Maxi sert à fiabiliser le pilotage des stocks d’agence à partir de trois sources principales :

1. les données articles ;
2. les données fournisseurs ;
3. les règles métier de réapprovisionnement.

L’objectif n’est pas seulement de calculer un mini et un maxi. L’objectif est d’éviter :

- les ruptures sur produits stratégiques ;
- les commandes impossibles à cause des conditionnements ;
- les surstocks sur produits lents, chers ou volumineux ;
- les seuils calculés sans délai fournisseur fiable ;
- les réapprovisionnements déconnectés du franco, du minimum de commande ou des multiples d’achat.

---

## 2. Fichiers du module

### 2.1 Référentiel métier

```text
/docs/stock-mini-maxi/REFERENTIEL_ANALYSE_FOURNISSEUR_MINI_MAXI.md
```

Rôle : définir les règles métier d’analyse fournisseur.

Ce fichier sert à :

- cadrer l’analyse IA ;
- éviter les déductions dangereuses ;
- préciser les données utiles au stock ;
- distinguer fait, hypothèse, donnée manquante et recommandation ;
- imposer les règles anti-hallucination.

À utiliser quand :

- un nouveau fournisseur doit être qualifié ;
- une base fournisseur doit être nettoyée ;
- une application HTML doit intégrer une logique stock ;
- un prompt doit analyser une fiche fournisseur, un tarif ou un fichier produit.

---

### 2.2 Schéma JSON

```text
/data/schemas/fournisseur_stock_mini_maxi.schema.json
```

Rôle : fournir une structure technique stable pour les exports JSON.

Ce fichier sert à :

- valider les réponses IA ;
- alimenter Make ;
- structurer les imports Glide ;
- préparer les données pour une application HTML ;
- garantir que les champs importants sont toujours présents.

À utiliser quand :

- une analyse fournisseur doit produire un JSON exploitable ;
- Make doit parser automatiquement une réponse IA ;
- l’application doit contrôler si une donnée critique est absente ;
- un fichier fournisseur doit être converti en données normalisées.

---

### 2.3 Modèle Google Sheets / CSV

```text
/templates/google-sheets/colonnes_fournisseur_stock_mini_maxi.csv
```

Rôle : fournir une base de colonnes pour créer un fichier Google Sheets propre.

Ce fichier sert à :

- préparer une base fournisseurs ;
- préparer une base articles ;
- importer des données dans Glide ;
- connecter une automatisation Make ;
- contrôler les mini/maxi avec des colonnes homogènes.

À utiliser quand :

- une nouvelle feuille Google Sheets doit être créée ;
- les données fournisseur doivent être importées ;
- les exports JSON doivent être aplatis en tableau ;
- les commerciaux ou l’agence doivent compléter les informations manquantes.

---

## 3. Architecture logique recommandée

```text
Fournisseur / Tarif / Fiche produit
            ↓
Analyse IA avec le référentiel métier
            ↓
Sortie JSON conforme au schéma
            ↓
Contrôle des données manquantes
            ↓
Mise à jour Google Sheets
            ↓
Exploitation dans Glide / HTML / Make
            ↓
Alertes stock : sous-mini, surstock, risque rupture, données manquantes
```

---

## 4. Règles métier prioritaires

### 4.1 Règle de vérité

Ne jamais inventer un mini ou un maxi chiffré si les données nécessaires sont absentes.

Données nécessaires pour un calcul fiable :

- consommation moyenne ;
- délai fournisseur prudent ;
- stock de sécurité ;
- conditionnement ;
- multiple d’achat ;
- capacité de stockage ou contrainte de volume.

Si la consommation moyenne est absente, indiquer :

```text
Calcul mini/maxi impossible sans consommation moyenne.
```

---

### 4.2 Règle délai fournisseur

Si un délai fournisseur est donné sous forme de fourchette, utiliser la valeur haute pour le calcul prudent.

Exemple :

```text
Délai annoncé : 3 à 5 jours
Délai prudent utilisé : 5 jours
```

---

### 4.3 Règle conditionnement

La quantité de réapprovisionnement doit toujours respecter :

- le colisage ;
- le multiple d’achat ;
- la quantité par palette ;
- le minimum de commande ;
- le franco ;
- la capacité de stockage.

Si le conditionnement est inconnu, indiquer :

```text
Réapprovisionnement à sécuriser : conditionnement fournisseur inconnu.
```

---

### 4.4 Règle priorité produit

Un produit est prioritaire si au moins un des critères suivants est vrai :

- forte rotation ;
- indispensable chantier ;
- forte marge ;
- faible substituabilité ;
- délai fournisseur long ;
- historique de rupture ;
- produit d’appel agence ;
- produit attendu par les clients pros.

---

### 4.5 Règle anti-surstock

Réduire ou surveiller le stock maximum si le produit est :

- lent ;
- cher ;
- volumineux ;
- fragile ;
- périssable ;
- saisonnier ;
- facilement disponible chez le fournisseur ;
- facilement substituable.

---

## 5. Méthode d’utilisation en agence

### Étape 1 — Collecter les données fournisseur

Sources possibles :

- tarif fournisseur ;
- fichier Excel fournisseur ;
- catalogue ;
- fiche produit ;
- conditions commerciales ;
- mail fournisseur ;
- échange commercial ;
- plateforme Tout Faire ;
- historique de commandes.

Ne pas se contenter d’un catalogue commercial. Un catalogue donne souvent les produits, mais pas les vraies contraintes de stock.

---

### Étape 2 — Lancer l’analyse fournisseur

Utiliser le prompt maître du référentiel :

```text
/docs/stock-mini-maxi/REFERENTIEL_ANALYSE_FOURNISSEUR_MINI_MAXI.md
```

L’analyse doit produire :

- une synthèse fournisseur ;
- les données utiles au stock ;
- les paramètres mini/maxi possibles ;
- les risques ;
- les données manquantes ;
- une sortie JSON.

---

### Étape 3 — Contrôler les données manquantes

Avant intégration complète, vérifier au minimum :

| Donnée | Statut attendu |
|---|---|
| Délai fournisseur moyen | Obligatoire |
| Délai fournisseur prudent | Obligatoire |
| Conditionnement | Obligatoire |
| Multiple d’achat | Obligatoire |
| Franco | Fortement recommandé |
| Minimum de commande | Fortement recommandé |
| Produits stockés fournisseur | Fortement recommandé |
| Produits sur commande | Fortement recommandé |
| Références alternatives | Recommandé |
| Taux de service | Recommandé |

---

### Étape 4 — Intégrer dans Google Sheets

Utiliser le modèle :

```text
/templates/google-sheets/colonnes_fournisseur_stock_mini_maxi.csv
```

La feuille doit permettre de distinguer :

- les données fournisseur ;
- les données article ;
- les données de consommation ;
- les paramètres mini/maxi ;
- les données manquantes ;
- les actions recommandées.

---

### Étape 5 — Exploiter dans l’application

L’application doit afficher au minimum :

- produits sous mini ;
- produits au-dessus du maxi ;
- produits sans consommation moyenne ;
- produits sans conditionnement ;
- produits sans délai fournisseur fiable ;
- produits prioritaires ;
- produits à risque rupture ;
- produits à commander ;
- produits à surveiller ;
- produits à sortir du stock permanent.

---

## 6. Statuts recommandés dans l’application

| Statut | Signification | Action |
|---|---|---|
| OK | Stock cohérent | Surveiller |
| Sous mini | Stock disponible inférieur au seuil | Commander |
| À commander | Réappro nécessaire | Vérifier conditionnement et franco |
| Surstock | Stock supérieur au maxi | Bloquer réappro ou action commerciale |
| Donnée critique manquante | Calcul non fiable | Compléter avant décision |
| Mini/maxi incompatible | Paramètre incohérent avec conditionnement | Recalculer |
| Produit stratégique | Produit à sécuriser | Priorité haute |
| Produit lent | Rotation faible | Réduire maxi |
| Commande spéciale | Ne doit pas être stocké par défaut | Commander à la demande |

---

## 7. Alertes prioritaires

### Alerte critique

Déclencher une alerte critique si :

- stock disponible inférieur au stock minimum sur produit stratégique ;
- produit prioritaire sans référence alternative ;
- délai fournisseur long et stock insuffisant ;
- conditionnement absent sur produit à forte rotation ;
- consommation absente mais mini/maxi chiffré existant.

### Alerte haute

Déclencher une alerte haute si :

- produit sous mini ;
- franco non atteint mais commande urgente ;
- multiple d’achat incompatible avec maxi ;
- historique de rupture récent ;
- fournisseur à fiabilité faible.

### Alerte moyenne

Déclencher une alerte moyenne si :

- produit proche du seuil ;
- donnée fournisseur partielle ;
- référence alternative non renseignée ;
- taux de service inconnu.

---

## 8. Champs essentiels pour une V1

Pour une première version exploitable, ne pas chercher à tout remplir.

Champs minimaux recommandés :

```text
fournisseur
famille_produit
reference_fournisseur
reference_interne
designation
unite_stock
conditionnement
multiple_achat
delai_livraison_prudent_jours
consommation_90j
stock_physique
stock_reserve_client
stock_disponible
stock_minimum
stock_maximum
seuil_alerte
quantite_reapprovisionnement
priorite_stock
risque_rupture_fournisseur
donnees_manquantes
action_recommandee
```

---

## 9. Contrôles qualité avant validation

Avant de valider un fournisseur dans le module :

- vérifier que les délais ne sont pas uniquement théoriques ;
- vérifier que les conditionnements sont bien par référence ;
- vérifier que les unités achat / stock / vente ne sont pas confondues ;
- vérifier que le mini est inférieur ou égal au maxi ;
- vérifier que la quantité de réappro respecte les multiples d’achat ;
- vérifier que les produits lents n’ont pas un maxi trop élevé ;
- vérifier que les produits stratégiques n’ont pas un stock de sécurité trop faible ;
- vérifier que les données manquantes critiques bloquent bien le calcul automatique.

---

## 10. Décision d’architecture

La logique métier ne doit pas être codée uniquement dans le HTML.

Répartition correcte :

```text
/docs       → règles métier, prompts, méthode
/data       → schémas, structures JSON, exemples non sensibles
/templates  → modèles CSV, Google Sheets, imports
/src        → interface HTML/CSS/JS
/exports    → exports générés ou exemples anonymisés
/rapports   → audits, contrôles, comptes rendus
```

Le HTML doit afficher, contrôler et aider à décider.  
Il ne doit pas contenir de secret, d’identifiant, de requête AS400, de chaîne ODBC ou de logique fournisseur sensible.

---

## 11. Prochaine évolution recommandée

Créer ensuite un exemple de fichier fournisseur fictif :

```text
/data/examples/exemple_fournisseur_stock_mini_maxi.json
```

Puis créer un scénario d’usage :

```text
/docs/stock-mini-maxi/SCENARIO_USAGE_ANALYSE_FOURNISSEUR.md
```

Ces deux fichiers permettront de tester concrètement le module avant intégration dans l’application HTML ou Glide.

---

## 12. Verdict

Module prêt pour une V1 documentaire et structurante.

État actuel :

- référentiel métier : présent ;
- schéma JSON : présent ;
- modèle Google Sheets : présent ;
- guide d’utilisation : présent ;
- exemple de données : à créer ;
- scénario Make / Glide : à créer ;
- interface HTML : à connecter ensuite.

Priorité suivante : créer un exemple JSON fictif pour tester le flux complet sans données sensibles.
