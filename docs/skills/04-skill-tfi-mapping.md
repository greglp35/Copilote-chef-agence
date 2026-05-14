# Skill 04 — Mapping CSV / TFI / ERP

Version : V1.0  
Statut : compétence critique  
Projet : Copilote Chef d’Agence  
Usage : préparer des exports contrôlés vers TFI / ERP sans connexion directe ni modification automatique.

---

## 1. Objectif

Ce skill sert à cadrer les fichiers de correspondance entre l’application métier et les champs TFI / ERP.

L’objectif est de produire des fichiers de contrôle propres, lisibles et validables humainement avant toute saisie ou import.

---

## 2. Règles prioritaires

- Pas de connexion directe TFI dans le HTML.
- Pas d’identifiant AS400 dans le HTML.
- Pas de chaîne ODBC dans le HTML.
- Pas de requête SQL sensible dans le HTML.
- Pas d’écriture automatique dans TFI au départ.
- Export uniquement après validation humaine.
- Conservation des anciennes et nouvelles valeurs.
- Justification obligatoire pour chaque modification sensible.
- Version du mapping obligatoire.

---

## 3. Champs utiles dans un mapping

```text
champ_application
champ_tfi
libelle_tfi
type_donnee
obligatoire
format_attendu
regle_transformation
controle_avant_export
risque_en_cas_erreur
autorise_reinjection
commentaire
```

---

## 4. Champs de sécurité export

Prévoir dans les exports :

```text
statut_export
validation_humaine
validateur
date_validation
justification_modification
ancienne_valeur
nouvelle_valeur
version_mapping_tfi
source_donnee
commentaire_controle
```

---

## 5. Statuts recommandés

```text
PRET_TFI
A_VALIDER
BLOQUE_DONNEES_MANQUANTES
BLOQUE_INCOHERENCE
BLOQUE_SECURITE
IGNORE
```

Exporter uniquement les lignes `PRET_TFI`.

---

## 6. Contrôles obligatoires

Avant export :

- référence interne TFI présente ;
- référence non doublonnée ;
- ancienne valeur conservée ;
- nouvelle valeur cohérente ;
- mini inférieur ou égal au maxi ;
- unité connue ;
- conditionnement contrôlé ;
- validateur renseigné ;
- justification renseignée ;
- statut export autorisé ;
- version mapping renseignée.

---

## 7. Anti-patterns à refuser

À éviter :

- export sans statut ;
- export sans validateur ;
- modification sans ancienne valeur ;
- mapping non versionné ;
- champs TFI supposés mais non confirmés ;
- réinjection automatique sans recette ;
- fichier CSV impossible à relire par un humain ;
- mélange entre données de test et données réelles.

---

## 8. Prompt court pour Codex

```text
Audite ce mapping CSV / TFI pour un outil métier de négoce matériaux. Vérifie les champs critiques, les formats, les règles de transformation, les contrôles avant export, la validation humaine, la traçabilité, les risques en cas d’erreur et l’absence de connexion ou secret ERP dans le HTML.
```

---

## 9. Verdict attendu

Un mapping TFI est acceptable s’il permet de préparer une décision fiable sans jamais modifier l’ERP automatiquement.