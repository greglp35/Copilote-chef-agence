# Référentiel métier — Analyse fournisseur pour stock mini / maxi

Version : V1.0  
Projet : Copilote Chef d’Agence / Stock Mini-Maxi  
Usage : négoce de matériaux de construction  
Statut : référentiel métier exploitable pour application, Google Sheets, Glide, Make ou GitHub

---

## 1. Rôle du référentiel

Ce référentiel sert à transformer des informations fournisseur en données utiles pour piloter un stock mini / maxi.

Il ne doit pas devenir une fiche fournisseur commerciale générale. Il doit uniquement conserver ce qui influence concrètement :

- le stock minimum ;
- le stock maximum ;
- le seuil d’alerte ;
- la quantité de réapprovisionnement ;
- le délai fournisseur ;
- le conditionnement ;
- le franco ;
- le minimum de commande ;
- le risque de rupture ;
- les références alternatives ;
- la fiabilité fournisseur ;
- la priorité de stockage.

---

## 2. Où intégrer ce référentiel dans le projet

### Emplacement principal recommandé

```text
/docs/stock-mini-maxi/REFERENTIEL_ANALYSE_FOURNISSEUR_MINI_MAXI.md
```

Rôle : document métier de référence.  
Utilisation : comprendre les règles, cadrer l’analyse IA, éviter les déductions dangereuses.

### Emplacement schéma JSON

```text
/data/schemas/fournisseur_stock_mini_maxi.schema.json
```

Rôle : structure technique des données pour Make, Glide, import JSON ou application HTML.

### Emplacement modèle Google Sheets / CSV

```text
/templates/google-sheets/colonnes_fournisseur_stock_mini_maxi.csv
```

Rôle : modèle de colonnes pour créer une base fournisseur exploitable.

### Ce qu’il ne faut pas faire

Ne pas intégrer directement ce prompt dans le HTML principal.  
Ne pas mélanger le référentiel métier avec les données fournisseurs réelles.  
Ne pas stocker de prix sensibles, identifiants ERP, accès AS400, requêtes SQL ou informations confidentielles dans le front HTML.

---

## 3. Principe métier

Un fournisseur ne doit être intégré dans le pilotage mini / maxi que si les données utiles sont suffisamment fiables.

Un stock mini / maxi chiffré ne doit jamais être inventé.

Si la consommation moyenne n’est pas connue, le calcul mini / maxi est impossible.

Si le conditionnement fournisseur n’est pas connu, la quantité de réapprovisionnement ne peut pas être fiabilisée.

Si le délai fournisseur réel n’est pas connu, il faut utiliser une hypothèse prudente et la signaler.

---

## 4. Données à extraire depuis un fournisseur

### Données critiques

| Donnée | Utilité stock | Niveau |
|---|---|---|
| Délai moyen de livraison | Calcule le stock minimum | Critique |
| Délai maximum constaté | Sécurise le calcul prudent | Critique |
| Consommation moyenne article | Calcule mini / maxi | Critique |
| Conditionnement | Définit la quantité de réapprovisionnement | Critique |
| Multiple d’achat | Évite les commandes impossibles | Critique |
| Minimum de commande | Influence le regroupement d’achats | Critique |
| Franco de port | Influence la taille des commandes | Haute |
| Produit stocké fournisseur | Réduit ou augmente le risque rupture | Haute |
| Produit sur commande | Augmente le stock de sécurité ou bascule en commande spéciale | Haute |
| Référence alternative | Réduit le risque client | Haute |

### Données importantes

| Donnée | Utilité stock | Niveau |
|---|---|---|
| Jours de commande | Planifie les réapprovisionnements | Haute |
| Jours de livraison | Ajuste les seuils d’alerte | Haute |
| Fréquence de livraison | Influence mini / maxi | Haute |
| Taux de service fournisseur | Mesure la fiabilité | Haute |
| Risque saisonnier | Ajuste les stocks avant période haute | Haute |
| Contrainte de stockage | Limite le stock maximum | Haute |
| Durée de validité | Évite les pertes | Moyenne |
| Variation tarifaire annoncée | Anticipe achat opportuniste ou hausse | Moyenne |

---

## 5. Règles de calcul mini / maxi

### Stock minimum

```text
stock minimum = consommation moyenne pendant le délai fournisseur + stock de sécurité
```

Le stock minimum doit couvrir :

- le délai fournisseur réel ;
- la consommation moyenne pendant ce délai ;
- une marge de sécurité adaptée au risque.

Si le délai est donné sous forme de fourchette, utiliser la valeur haute.

Exemple :

```text
Délai annoncé : 3 à 5 jours
Délai prudent à utiliser : 5 jours
```

### Stock de sécurité

Augmenter le stock de sécurité si :

- fournisseur peu fiable ;
- délai long ;
- délai variable ;
- produit stratégique ;
- produit indispensable chantier ;
- forte rotation ;
- faible substituabilité ;
- saisonnalité forte ;
- ruptures fréquentes.

Réduire le stock de sécurité si :

- produit lent ;
- produit cher ;
- produit volumineux ;
- produit fragile ;
- produit facilement substituable ;
- fournisseur local très réactif ;
- livraison fréquente.

### Stock maximum

```text
stock maximum = stock minimum + quantité optimale de réapprovisionnement
```

Le stock maximum doit tenir compte :

- du conditionnement fournisseur ;
- du multiple d’achat ;
- du franco ;
- de la place disponible ;
- du coût d’immobilisation ;
- du risque de surstock ;
- du volume physique ;
- de la rotation réelle.

### Seuil d’alerte

```text
seuil d’alerte = stock minimum
```

### Quantité de réapprovisionnement

La quantité de réapprovisionnement doit être compatible avec :

- colisage ;
- botte ;
- sac ;
- carton ;
- palette ;
- minimum de commande ;
- franco ;
- capacité de stockage.

Si le conditionnement est inconnu :

```text
Quantité de réapprovisionnement à confirmer selon conditionnement fournisseur.
```

---

## 6. Classification priorité stock

### Priorité haute

Produit à stocker en priorité si :

- forte rotation ;
- produit stratégique chantier ;
- marge intéressante ;
- rupture très pénalisante ;
- délai fournisseur long ;
- faible substituabilité ;
- produit d’appel important ;
- produit indispensable pour les clients pros.

### Priorité moyenne

Produit à surveiller si :

- rotation régulière mais non critique ;
- fournisseur fiable ;
- substitution possible ;
- impact client modéré.

### Priorité basse

Produit à limiter si :

- faible rotation ;
- encombrement élevé ;
- coût élevé ;
- achat ponctuel ;
- fragilité ;
- risque de surstock ;
- commande fournisseur simple et rapide.

---

## 7. Prompt maître à utiliser

```markdown
Tu es un expert senior en gestion de stock, achats fournisseurs, logistique négoce matériaux et paramétrage mini/maxi.

Ta mission est d’analyser les informations fournisseur fournies et d’en extraire uniquement les données utiles, pratiques, vérifiables et exploitables pour alimenter une application de stock mini/maxi dans un négoce de matériaux de construction.

DONNÉES FOURNISSEUR À ANALYSER :
{{informations_fournisseur}}

RÈGLES ABSOLUES :
- Ne conserve que les informations utiles au stock mini/maxi.
- Ne crée jamais de donnée certaine si elle n’est pas fournie.
- Si une donnée est absente, indique : Donnée non communiquée.
- Si une donnée est déduite, indique : Hypothèse déduite à confirmer.
- Si la consommation moyenne est absente, indique : Calcul mini/maxi impossible sans consommation moyenne par période.
- Si le conditionnement est absent, indique : Réapprovisionnement à sécuriser : conditionnement fournisseur inconnu.
- Si le délai fournisseur est donné sous forme de fourchette, utilise la valeur haute pour le calcul prudent.
- Ne donne jamais de mini/maxi chiffré sans consommation fiable.

ANALYSE EN PRIORITÉ :
- délai moyen de livraison ;
- délai minimum / maximum ;
- franco de port ;
- minimum de commande ;
- conditionnement ;
- quantité par palette, botte, colis, sac ou unité ;
- fréquence de livraison ;
- jours de commande ;
- jours de livraison ;
- saisonnalité ;
- risque de rupture fournisseur ;
- produits stockés chez le fournisseur ;
- produits sur commande ;
- produits stratégiques ;
- produits à forte rotation ;
- produits à faible rotation ;
- références de substitution ;
- contraintes de stockage ;
- durée de validité ;
- variation tarifaire ;
- fiabilité commerciale ;
- taux de service ;
- contraintes logistiques ;
- typologie fournisseur.

SORTIE ATTENDUE EN 6 BLOCS :

BLOC 1 — SYNTHÈSE FOURNISSEUR
Synthèse courte et opérationnelle.

BLOC 2 — DONNÉES STRUCTURÉES POUR APPLICATION
Tableau : Champ application | Valeur extraite ou déduite | Type de donnée | Niveau de fiabilité | Impact stock | Action recommandée.

BLOC 3 — PARAMÈTRES MINI/MAXI RECOMMANDÉS
Tableau : Famille produit | Produit ou référence | Délai fournisseur prudent | Stock minimum recommandé | Stock maximum recommandé | Seuil d’alerte | Quantité de réapprovisionnement | Niveau de priorité | Justification.

BLOC 4 — RISQUES STOCK IDENTIFIÉS
Tableau : Risque identifié | Cause probable | Impact possible | Niveau de gravité | Mesure de maîtrise recommandée.

BLOC 5 — DONNÉES MANQUANTES À DEMANDER AU FOURNISSEUR
Tableau : Donnée manquante | Question précise à poser au fournisseur | Importance | Pourquoi c’est important.

BLOC 6 — SORTIE JSON POUR MAKE / GLIDE
Retourne un JSON propre conforme au schéma fournisseur_stock_mini_maxi.schema.json.

VERDICT FINAL :
- Fournisseur exploitable pour stock mini/maxi : Oui / Non / Partiellement
- Niveau de données disponibles : Faible / Moyen / Bon / Très bon
- Calcul mini/maxi fiable possible : Oui / Non / Partiellement
- Priorité d’action : Faible / Moyenne / Haute / Critique
- Prochaine action recommandée : action concrète
```

---

## 8. Questions fournisseur à poser systématiquement

### Critique

| Donnée manquante | Question fournisseur | Pourquoi |
|---|---|---|
| Délai réel | Quel est le délai moyen réel de livraison constaté sur les 12 derniers mois ? | Base du stock minimum |
| Délai maximum | Quel est le délai maximum constaté en période normale et en période haute ? | Sécurise le délai prudent |
| Conditionnement | Pouvez-vous fournir le conditionnement par référence ? | Calcule la quantité de réapprovisionnement |
| Multiple d’achat | Quels sont les multiples d’achat obligatoires par référence ? | Évite les commandes impossibles |
| Produits stockés | Quelles références sont tenues en stock permanent chez vous ? | Évalue le risque de rupture |
| Produits sur commande | Quelles références sont uniquement fabriquées ou commandées à la demande ? | Décide stock ou commande spéciale |

### Haute

| Donnée manquante | Question fournisseur | Pourquoi |
|---|---|---|
| Franco | Quel est le franco de port par famille produit ? | Optimise les commandes |
| Minimum commande | Existe-t-il un minimum de commande global ou par référence ? | Évite les petites commandes non rentables |
| Jours commande | Y a-t-il des jours fixes de commande ? | Organise le planning achat |
| Jours livraison | Y a-t-il des jours fixes de livraison ? | Ajuste le seuil d’alerte |
| Taux service | Quel est votre taux de service moyen ? | Mesure la fiabilité |
| Substitution | Quelles références alternatives proposez-vous en cas de rupture ? | Réduit le risque client |

---

## 9. Recommandations d’intégration application

### Dans Google Sheets

Créer une table fournisseurs avec les colonnes du fichier :

```text
/templates/google-sheets/colonnes_fournisseur_stock_mini_maxi.csv
```

Créer une table articles séparée avec :

- référence interne ;
- référence fournisseur ;
- famille produit ;
- unité achat ;
- unité stock ;
- unité vente ;
- conditionnement ;
- multiple achat ;
- consommation 30 jours ;
- consommation 90 jours ;
- stock minimum ;
- stock maximum ;
- seuil alerte ;
- priorité ;
- risque rupture.

### Dans Glide

Prévoir trois vues :

1. Fournisseur : données logistiques et fiabilité.
2. Articles : mini/maxi, conditionnement, priorité.
3. Alertes : rupture, sous-mini, surstock, données manquantes.

### Dans Make

Créer un scénario :

1. Récupérer les informations fournisseur.
2. Envoyer au prompt d’analyse.
3. Parser le JSON.
4. Mettre à jour Google Sheets.
5. Créer une alerte si donnée critique manquante.
6. Journaliser la décision.

---

## 10. Verdict d’utilisation

Ce référentiel est pertinent à trois endroits du projet :

1. Documentation métier dans `/docs/stock-mini-maxi/`.
2. Structure technique dans `/data/schemas/`.
3. Modèle d’import dans `/templates/google-sheets/`.

Il ne doit pas être placé directement dans l’interface HTML principale. L’interface doit seulement exploiter les résultats structurés, pas porter toute la logique métier en dur.
