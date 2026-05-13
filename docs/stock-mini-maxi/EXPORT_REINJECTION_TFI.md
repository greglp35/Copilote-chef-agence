# Export et réinjection TFI — Stock Mini / Maxi

Version : V1.0  
Projet : Copilote Chef d’Agence  
Module : Stock Mini / Maxi  
Périmètre : extraction, validation et préparation de données pour réintégration dans TFI / AS400  
Statut : cadrage fonctionnel sécurisé

---

## 1. Objectif

Permettre à l’application Stock Mini / Maxi de préparer des données propres, contrôlées et validées afin de pouvoir les réinjecter dans TFI lorsque le format d’import TFI est confirmé.

L’objectif n’est pas de connecter directement l’application HTML à TFI.

L’objectif est de produire un fichier d’export fiable, relisible et validé, utilisable ensuite pour :

- import manuel dans TFI ;
- contrôle par le service informatique ;
- traitement via outil interne ;
- réintégration encadrée selon les règles TFI ;
- audit avant mise à jour des paramètres articles.

---

## 2. Principe de sécurité

### Règle prioritaire

```text
Aucune écriture directe dans TFI / AS400 depuis l’application HTML.
```

L’application peut :

- lire des exports ;
- analyser ;
- proposer ;
- préparer un fichier ;
- journaliser ;
- signaler les anomalies.

L’application ne doit pas :

- se connecter directement à TFI ;
- stocker des identifiants AS400 ;
- contenir une chaîne ODBC ;
- contenir une requête SQL sensible ;
- modifier TFI sans validation humaine ;
- pousser automatiquement des mini/maxi en production.

---

## 3. Architecture recommandée

```text
TFI / AS400
   ↓ extraction officielle ou ODBC lecture seule
Export brut articles / stock / ventes / fournisseurs
   ↓
Application Stock Mini / Maxi
   ↓ analyse, calcul, contrôles, alertes
Fichier de préparation réinjection
   ↓
Contrôle humain + validation chef d’agence / responsable habilité
   ↓
Fichier final conforme au format TFI
   ↓
Réinjection TFI par procédure autorisée
   ↓
Journal de décision + preuve d’import
```

---

## 4. Données candidates à réinjecter dans TFI

Les données à réinjecter doivent être limitées aux champs réellement nécessaires.

### Champs potentiellement réinjectables

| Champ | Usage | Condition de réinjection |
|---|---|---|
| Référence article interne | Identifier l’article TFI | Obligatoire |
| Code fournisseur principal | Mettre à jour fournisseur si autorisé | À confirmer |
| Référence fournisseur | Fiabiliser achat | À confirmer |
| Stock minimum proposé | Paramètre mini | Validation obligatoire |
| Stock maximum proposé | Paramètre maxi | Validation obligatoire |
| Seuil d’alerte proposé | Alerte réappro | Validation obligatoire |
| Multiple d’achat | Cohérence commande | Format TFI à confirmer |
| Conditionnement achat | Cohérence réappro | Format TFI à confirmer |
| Délai fournisseur prudent | Sécurisation mini | Format TFI à confirmer |
| Statut stock / commande spéciale | Décision stock permanent ou non | À confirmer |

### Champs à ne pas réinjecter sans validation renforcée

| Champ | Risque |
|---|---|
| Prix d’achat | Impact marge et tarif |
| Prix de vente | Impact commercial direct |
| Remises fournisseur | Donnée sensible |
| Code famille comptable | Risque de mauvaise imputation |
| Code TVA | Risque fiscal |
| Unité de vente | Risque d’erreur facture |
| Unité de stock | Risque d’erreur quantité |
| Libellé article | Risque catalogue / facturation |

---

## 5. Règles de validation avant export TFI

Un article ne doit être exporté pour réinjection que si :

- la référence interne TFI est présente ;
- la référence n’est pas en doublon ;
- la consommation moyenne est connue ou le calcul est justifié ;
- le stock minimum est inférieur ou égal au stock maximum ;
- le stock minimum n’est pas négatif ;
- le stock maximum n’est pas négatif ;
- la quantité de réapprovisionnement respecte le multiple d’achat ;
- le conditionnement est renseigné si la quantité de réappro est calculée ;
- le niveau de fiabilité est au minimum moyen ;
- les données critiques manquantes sont résolues ;
- la décision humaine est validée.

---

## 6. Statuts d’export recommandés

| Statut export | Signification | Action |
|---|---|---|
| PRET_TFI | Données prêtes à être exportées | Inclure dans fichier final |
| A_VALIDER | Données cohérentes mais nécessitant contrôle humain | Vérifier avant export |
| BLOQUE_DONNEES_MANQUANTES | Donnée critique absente | Compléter avant export |
| BLOQUE_INCOHERENCE | Mini/maxi ou conditionnement incohérent | Corriger |
| BLOQUE_SECURITE | Champ sensible ou non autorisé | Exclure |
| IGNORE | Article non concerné par la réinjection | Ne pas exporter |

---

## 7. Format de fichier recommandé

En attendant le format exact TFI, utiliser un fichier de préparation neutre :

```text
/templates/tfi/export_reinjection_tfi_stock_mini_maxi.csv
```

Ce fichier ne prétend pas être le format officiel TFI.  
Il sert de fichier de travail validé avant transformation dans le format attendu par TFI.

---

## 8. Mapping TFI obligatoire

Avant toute réinjection réelle, créer ou compléter le fichier :

```text
/templates/tfi/mapping_tfi_stock_mini_maxi.csv
```

Ce fichier doit préciser :

- champ application ;
- champ TFI correspondant ;
- obligatoire ou non ;
- format attendu ;
- règle de transformation ;
- validation nécessaire ;
- risque en cas d’erreur.

Aucun import réel ne doit être fait tant que le mapping TFI n’est pas validé.

---

## 9. Contrôles automatiques recommandés

L’application doit afficher un contrôle avant export :

| Contrôle | Blocage |
|---|---|
| Référence interne vide | Oui |
| Doublon référence interne | Oui |
| Mini supérieur au maxi | Oui |
| Mini ou maxi négatif | Oui |
| Mini/maxi calculé sans consommation | Oui |
| Conditionnement absent sur article à réappro | Oui |
| Multiple achat absent | Alerte haute ou blocage selon famille |
| Fournisseur inconnu | Alerte haute |
| Niveau fiabilité faible | Blocage sauf validation exceptionnelle |
| Champ sensible présent dans export | Blocage |

---

## 10. Journalisation obligatoire

Chaque export destiné à TFI doit générer un journal.

Champs recommandés :

- date export ;
- utilisateur ;
- nombre de lignes exportées ;
- nombre de lignes bloquées ;
- nombre de lignes à valider ;
- nom du fichier généré ;
- version du mapping ;
- commentaire de validation ;
- statut final ;
- preuve d’import si disponible.

---

## 11. Processus recommandé en agence

### Étape 1 — Extraction TFI

Récupérer un export TFI / AS400 en lecture seule :

- articles ;
- stock physique ;
- stock réservé ;
- ventes 30 / 90 / 365 jours ;
- commandes fournisseurs en cours ;
- fournisseur principal ;
- unités ;
- mini/maxi existants si disponibles.

### Étape 2 — Analyse dans l’application

L’application calcule ou propose :

- stock minimum recommandé ;
- stock maximum recommandé ;
- seuil d’alerte ;
- quantité de réapprovisionnement ;
- statut article ;
- niveau de risque ;
- action recommandée.

### Étape 3 — Préparation export

L’application génère un fichier de préparation TFI avec :

- seulement les articles modifiés ;
- les anciennes valeurs ;
- les nouvelles valeurs proposées ;
- la justification ;
- le statut export ;
- la validation humaine.

### Étape 4 — Contrôle humain

Le chef d’agence ou une personne habilitée valide les lignes en statut :

```text
A_VALIDER
```

Les lignes bloquées ne doivent pas sortir dans le fichier final.

### Étape 5 — Export final

Le fichier final ne doit contenir que :

```text
PRET_TFI
```

### Étape 6 — Réinjection TFI

La réinjection doit être réalisée uniquement selon une procédure autorisée :

- import TFI officiel ;
- traitement informatique interne ;
- contrôle par personne habilitée ;
- procédure validée groupe / DSI / responsable métier.

---

## 12. Limites actuelles

Le format officiel d’import TFI n’est pas encore connu dans ce référentiel.

Les champs exacts TFI doivent être confirmés avant toute réinjection.

Le fichier CSV fourni est donc un format de préparation, pas une garantie de compatibilité directe.

---

## 13. Verdict

La réinjection vers TFI est pertinente, mais uniquement avec une logique de sas de validation.

Décision d’architecture recommandée :

```text
Application → Export contrôlé → Validation humaine → Format TFI confirmé → Import TFI autorisé
```

À ne pas faire :

```text
Application HTML → écriture directe TFI
```

Prochaine action : compléter le mapping entre les champs application et les champs TFI réels.
