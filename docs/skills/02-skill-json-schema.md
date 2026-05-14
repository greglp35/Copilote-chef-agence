# Skill 02 — JSON Schema et contrats de données

Version : V1.0  
Statut : compétence prioritaire  
Projet : Copilote Chef d’Agence  
Usage : structurer, valider et sécuriser les données utilisées par les applications HTML métier.

---

## 1. Objectif

Ce skill sert à créer des contrats de données fiables pour les imports, exports, fichiers exemples, mappings et échanges entre outils.

Le but est d’éviter les données floues, incomplètes ou dangereuses qui rendent les calculs faux et les décisions non fiables.

---

## 2. Règles prioritaires

- Tout fichier importé doit avoir une structure attendue.
- Les champs critiques doivent être obligatoires.
- Les valeurs sensibles ne doivent pas être stockées dans les exemples.
- Les données manquantes doivent être visibles.
- Les formats doivent être contrôlés avant exploitation.
- Les exports doivent être lisibles par un humain et par une machine.
- Les schémas doivent rester compréhensibles par un non-développeur.

---

## 3. Données concernées

Ce skill s’applique à :

- articles ;
- fournisseurs ;
- stocks ;
- commandes ;
- livraisons ;
- zonage ;
- clients anonymisés ;
- alertes ;
- actions ;
- journaux de décision ;
- mappings TFI / ERP.

---

## 4. Structure recommandée

```text
/data/schemas/nom-module.schema.json
/data/examples/nom-module.example.json
/templates/csv/nom-module-template.csv
/docs/nom-module/METHODE_IMPORT.md
```

---

## 5. Champs de contrôle utiles

Prévoir souvent :

```text
id
source
version_schema
date_import
statut_validation
validation_humaine
donnees_manquantes
niveau_fiabilite
risque
commentaire_controle
```

---

## 6. Checklist qualité

Avant validation d’un schéma :

- les champs obligatoires sont clairement identifiés ;
- les types sont cohérents ;
- les valeurs possibles sont limitées si nécessaire ;
- les erreurs métier sont anticipées ;
- les champs sensibles sont exclus ;
- un exemple fictif existe ;
- un modèle CSV existe si import tableur prévu ;
- la version du schéma est indiquée ;
- les données manquantes sont gérées.

---

## 7. Anti-patterns à refuser

À éviter :

- JSON sans schéma ;
- champs nommés de plusieurs façons pour la même donnée ;
- formats de dates mélangés ;
- valeurs libres quand un statut fermé suffit ;
- prix sensibles ou secrets dans les exemples ;
- absence de version ;
- export impossible à relire humainement.

---

## 8. Prompt court pour Codex

```text
Audite ce schéma JSON pour une application HTML métier de négoce matériaux. Vérifie les champs obligatoires, les types, les statuts, les données manquantes, la sécurité, les exemples attendus et la compatibilité import/export CSV. Propose les corrections sans complexifier inutilement.
```

---

## 9. Verdict attendu

Un contrat de données est acceptable s’il permet :

- d’importer proprement ;
- de bloquer les données dangereuses ;
- d’expliquer les erreurs ;
- d’exporter de manière traçable ;
- de servir de base stable à une application HTML ou une automatisation.