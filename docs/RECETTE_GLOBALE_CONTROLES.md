# Recette globale — contrôles automatisés

Version : V1.0  
Projet : Copilote Chef d’Agence

---

## Objectif

Ce document recense les contrôles automatisés utilisés dans la recette globale du dépôt.

La recette vise à vérifier la stabilité minimale du projet avant fusion : structure, JSON, sécurité, HTML, règles métier stock / TFI et fiches projet.

---

## Contrôles de non-régression

| Contrôle | Script | Sévérité |
|---|---|---|
| Détecteur JSON | `scripts/test-json-check.js` | Bloquant |
| Détecteur anti-secrets | `scripts/test-no-secrets-check.js` | Bloquant |
| Détecteur dépendances HTML | `scripts/test-html-dependencies-check.js` | Bloquant |
| Règles métier stock / TFI | `scripts/test-stock-tfi-rules-check.js` | Bloquant |
| Qualité HTML | `scripts/test-html-quality-check.js` | Bloquant |
| Fiche projet | `scripts/test-fiche-projet-check.js` | Bloquant |

---

## Contrôles réels du dépôt

| Contrôle | Script | Sévérité |
|---|---|---|
| Structure projet | `scripts/check-structure.js` | Bloquant |
| JSON | `scripts/check-json.js` | Bloquant |
| Anti-secrets | `scripts/check-no-secrets.js` | Bloquant |
| Dépendances HTML externes | `scripts/check-html-dependencies.js` | Bloquant |
| Règles métier stock / TFI | `scripts/check-stock-tfi-rules.js` | Bloquant |
| Qualité HTML minimale | `scripts/check-html-quality.js` | Mixte : erreurs bloquantes + avertissements |
| Fiches projet obligatoires | `scripts/check-fiche-projet.js` | Bloquant |

---

## Règle de sévérité

Un contrôle est bloquant lorsqu’il protège :

- la sécurité ;
- la cohérence métier ;
- la traçabilité ;
- l’absence de secrets ;
- la fiabilité minimale des fichiers ;
- la validation humaine.

Un contrôle reste en avertissement lorsqu’il améliore la qualité sans risque immédiat de casse ou de danger opérationnel.

---

## Règle de fusion

Une Pull Request peut être fusionnée automatiquement uniquement si :

- la recette globale passe ;
- les workflows GitHub associés sont verts ;
- aucun secret n’est exposé ;
- aucun changement destructif n’est présent ;
- aucun fichier critique n’est modifié sans raison claire ;
- la modification reste limitée et réversible.

---

## Validation humaine

Un contrôle automatisé vert ne remplace pas la validation humaine avant diffusion terrain.

La validation humaine reste obligatoire pour :

- changement métier ;
- modification de logique stock ;
- modification d’exports TFI ;
- changement de sécurité ;
- diffusion d’un outil à des utilisateurs réels.