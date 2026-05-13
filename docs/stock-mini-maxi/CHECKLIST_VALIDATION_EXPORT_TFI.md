# Checklist de validation avant export TFI — Stock Mini / Maxi

Version : V1.0  
Projet : Copilote Chef d’Agence  
Module : Stock Mini / Maxi  
Périmètre : contrôle avant préparation ou réinjection TFI / AS400  
Statut : checklist de sécurité fonctionnelle

---

## 1. Objectif

Cette checklist sert à contrôler les données stock mini / maxi avant toute préparation d’export vers TFI.

Elle doit empêcher l’export de lignes :

- incomplètes ;
- incohérentes ;
- non validées ;
- calculées sans données fiables ;
- dangereuses pour le stock ;
- risquées pour TFI / AS400.

Le principe est simple :

```text
Pas de donnée fiable = pas de réinjection TFI.
```

---

## 2. Statuts de sortie autorisés

| Statut | Exportable vers fichier final TFI | Signification |
|---|---:|---|
| PRET_TFI | Oui | Ligne contrôlée, cohérente et validée |
| A_VALIDER | Non | Ligne cohérente mais non validée humainement |
| BLOQUE_DONNEES_MANQUANTES | Non | Donnée critique absente |
| BLOQUE_INCOHERENCE | Non | Mini/maxi, unité ou conditionnement incohérent |
| BLOQUE_SECURITE | Non | Champ sensible ou risque TFI identifié |
| IGNORE | Non | Article non concerné par la réinjection |

Règle stricte :

```text
Seules les lignes PRET_TFI peuvent sortir dans le fichier final.
```

---

## 3. Checklist article

### 3.1 Identification article

| Contrôle | Règle | Blocage |
|---|---|---:|
| Référence interne TFI présente | Obligatoire | Oui |
| Référence interne unique | Aucun doublon | Oui |
| Désignation présente | Recommandée pour contrôle visuel | Non |
| Famille produit présente | Obligatoire pour analyse | Oui |
| Fournisseur principal présent | Obligatoire si modification liée fournisseur | Oui selon cas |
| Référence fournisseur présente | Recommandée | Non |

---

### 3.2 Données stock

| Contrôle | Règle | Blocage |
|---|---|---:|
| Stock physique renseigné | Obligatoire pour contrôle | Oui |
| Stock réservé client renseigné | Recommandé | Non |
| Stock disponible calculé | Stock physique - stock réservé + commandes fournisseur en cours selon règle validée | Oui |
| Stock disponible non négatif ou justifié | Si négatif, alerte | Non |
| Commandes fournisseur en cours renseignées | Recommandé pour stock futur | Non |

---

### 3.3 Mini / maxi

| Contrôle | Règle | Blocage |
|---|---|---:|
| Nouveau stock minimum présent | Obligatoire si export mini | Oui |
| Nouveau stock maximum présent | Obligatoire si export maxi | Oui |
| Stock minimum >= 0 | Aucun mini négatif | Oui |
| Stock maximum >= 0 | Aucun maxi négatif | Oui |
| Stock minimum <= stock maximum | Incohérence bloquante si faux | Oui |
| Seuil d’alerte cohérent | Par défaut = stock minimum | Oui si seuil exporté |
| Mini/maxi différent de l’ancien | Exporter seulement si modification utile | Non |

---

### 3.4 Calcul et fiabilité

| Contrôle | Règle | Blocage |
|---|---|---:|
| Consommation moyenne connue | Obligatoire pour calcul automatique fiable | Oui si mini/maxi calculé |
| Période de consommation indiquée | 30j, 90j ou 365j | Oui si calcul automatique |
| Jours de rupture pris en compte | Recommandé pour fiabiliser moyenne | Non |
| Délai fournisseur prudent présent | Obligatoire pour stock minimum calculé | Oui |
| Niveau de fiabilité suffisant | Minimum moyen | Oui sauf validation exceptionnelle |
| Type de paramétrage cohérent | calculé / manuel / déduit à confirmer / impossible | Oui |

---

### 3.5 Conditionnement et achat

| Contrôle | Règle | Blocage |
|---|---|---:|
| Unité de stock connue | Obligatoire | Oui |
| Unité d’achat connue | Obligatoire si réappro calculé | Oui |
| Unité de vente connue | À ne pas modifier sans validation renforcée | Oui si exportée |
| Conditionnement renseigné | Obligatoire pour quantité de réappro | Oui |
| Multiple d’achat renseigné | Obligatoire si quantité de réappro calculée | Oui |
| Quantité de réappro multiple du multiple d’achat | Obligatoire | Oui |
| Quantité palette connue si achat palette | Obligatoire si palette utilisée | Oui selon cas |
| Minimum de commande compatible | À vérifier | Non ou oui selon famille |
| Franco pris en compte | Recommandé | Non |

---

### 3.6 Risque métier

| Contrôle | Règle | Blocage |
|---|---|---:|
| Produit stratégique identifié | Priorité haute si indispensable chantier | Non |
| Produit stratégique sous mini | Alerte forte | Non |
| Produit sans alternative | Alerte si risque rupture élevé | Non |
| Produit lent avec maxi élevé | Alerte surstock | Non |
| Produit volumineux avec maxi élevé | Alerte encombrement | Non |
| Produit fragile ou périssable | Maxi réduit recommandé | Non |
| Fournisseur à risque élevé | Validation renforcée | Oui si mini/maxi automatique |

---

## 4. Checklist fournisseur

| Contrôle | Règle | Blocage |
|---|---|---:|
| Fournisseur identifié | Obligatoire | Oui |
| Typologie fournisseur connue | Local, régional, national, industriel, importateur, plateforme | Non |
| Délai moyen connu | Recommandé | Non |
| Délai prudent connu | Obligatoire pour calcul | Oui |
| Franco connu | Recommandé | Non |
| Minimum de commande connu | Recommandé | Non |
| Jours de commande connus | Recommandé | Non |
| Jours de livraison connus | Recommandé | Non |
| Taux de service connu | Recommandé | Non |
| Produits stockés fournisseur connus | Recommandé | Non |
| Produits sur commande identifiés | Recommandé | Non |

---

## 5. Checklist sécurité TFI

| Contrôle | Règle | Blocage |
|---|---|---:|
| Aucun identifiant AS400 dans le fichier | Strictement interdit | Oui |
| Aucun mot de passe | Strictement interdit | Oui |
| Aucun token API | Strictement interdit | Oui |
| Aucune chaîne ODBC | Strictement interdit | Oui |
| Aucune requête SQL sensible | Strictement interdit | Oui |
| Aucun prix d’achat si non nécessaire | Donnée sensible | Oui selon périmètre |
| Aucun prix de vente si non nécessaire | Donnée sensible | Oui selon périmètre |
| Mapping TFI renseigné | Obligatoire avant import réel | Oui |
| Version mapping indiquée | Obligatoire | Oui |
| Validateur indiqué | Obligatoire | Oui |
| Date validation indiquée | Obligatoire | Oui |

---

## 6. Règles de blocage automatique

Une ligne doit passer en `BLOQUE_DONNEES_MANQUANTES` si :

- référence interne TFI absente ;
- consommation moyenne absente alors que mini/maxi calculé ;
- délai prudent absent alors que mini calculé ;
- conditionnement absent alors que réappro calculé ;
- multiple d’achat absent alors que réappro calculé ;
- unité stock absente ;
- validation humaine absente.

Une ligne doit passer en `BLOQUE_INCOHERENCE` si :

- mini > maxi ;
- mini négatif ;
- maxi négatif ;
- quantité de réappro non compatible avec le multiple d’achat ;
- unité achat / stock / vente incohérente ;
- référence interne en doublon ;
- ancien et nouveau paramètre identiques sans justification.

Une ligne doit passer en `BLOQUE_SECURITE` si :

- un secret technique est présent ;
- une donnée sensible non prévue est incluse ;
- le mapping TFI est absent ;
- le champ TFI cible n’est pas confirmé ;
- l’export cherche à modifier un champ sensible non autorisé.

---

## 7. Règle de validation humaine

Aucune ligne ne peut passer en `PRET_TFI` sans :

- validation humaine = OUI ;
- nom du validateur ;
- date de validation ;
- justification de modification ;
- version du mapping TFI ;
- statut final contrôlé.

Format recommandé :

```text
validation_humaine = OUI
validateur = Nom / rôle
 date_validation = YYYY-MM-DD
version_mapping_tfi = V1.0
```

---

## 8. Contrôles avant génération du fichier final

Avant de générer le fichier final destiné à TFI, contrôler :

| Indicateur | Objectif |
|---|---:|
| Nombre total de lignes analysées | Information |
| Nombre de lignes PRET_TFI | À exporter |
| Nombre de lignes A_VALIDER | À exclure |
| Nombre de lignes bloquées | À exclure |
| Nombre de doublons référence interne | 0 |
| Nombre de mini > maxi | 0 |
| Nombre de lignes sans validation humaine | 0 dans export final |
| Nombre de lignes sans mapping TFI | 0 dans export final |
| Nombre de champs sensibles détectés | 0 |

---

## 9. Sortie attendue par l’application

L’application doit produire deux exports séparés.

### 9.1 Export de travail

Contient toutes les lignes :

- PRET_TFI ;
- A_VALIDER ;
- BLOQUE_DONNEES_MANQUANTES ;
- BLOQUE_INCOHERENCE ;
- BLOQUE_SECURITE ;
- IGNORE.

But : audit et correction.

### 9.2 Export final TFI

Contient uniquement :

```text
PRET_TFI
```

But : import ou traitement par procédure autorisée.

---

## 10. Journal d’export obligatoire

Chaque génération doit créer une trace :

```text
/exports/tfi/journal_exports_tfi.csv
```

Colonnes recommandées :

```csv
date_export,utilisateur,type_export,nombre_lignes_total,nombre_lignes_pret_tfi,nombre_lignes_a_valider,nombre_lignes_bloquees,nom_fichier_export,version_mapping_tfi,commentaire,statut_final
```

---

## 11. Critères d’acceptation V1

La V1 est acceptable si :

- aucune ligne non validée ne peut sortir dans l’export final ;
- les mini/maxi incohérents sont bloqués ;
- les données critiques manquantes sont visibles ;
- le mapping TFI est obligatoire ;
- les champs sensibles sont exclus ;
- l’utilisateur comprend pourquoi une ligne est bloquée ;
- le fichier de travail reste exploitable pour correction ;
- le fichier final ne contient que les lignes prêtes.

---

## 12. Verdict

Cette checklist doit être appliquée avant toute réinjection TFI.

La logique cible est :

```text
Analyse → Contrôle → Blocage si risque → Validation humaine → Export final PRET_TFI
```

Aucune automatisation d’écriture TFI ne doit être envisagée tant que le format TFI officiel et les droits d’import ne sont pas confirmés.
