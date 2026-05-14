# État qualité du projet — Copilote Chef d’Agence

Version : V1.1  
Date : 2026-05-14  
Statut : synthèse opérationnelle

---

## 1. Objectif

Ce document donne une vue simple de l’état qualité actuel du dépôt.

Il sert à savoir rapidement :

- quels contrôles sont actifs ;
- quels rapports sont générés ;
- quelles règles de fusion sont appliquées ;
- quelles prochaines améliorations sont recommandées.

---

## 2. Principe qualité du dépôt

Le dépôt privilégie :

1. sécurité ;
2. stabilité ;
3. traçabilité ;
4. tests ;
5. documentation ;
6. simplicité ;
7. amélioration progressive.

Aucun changement important ne doit être fusionné sans contrôle vert.

---

## 3. Contrôles actifs dans la recette globale

La recette globale est lancée par :

```bash
node scripts/run-recette-complete.js
```

Elle exécute les contrôles suivants :

| Domaine | Script | Rôle | Sévérité |
|---|---|---|---|
| JSON | `scripts/check-json.js` | Vérifier la validité des fichiers JSON | Bloquant |
| Sécurité | `scripts/check-no-secrets.js` | Détecter secrets, tokens, chaînes sensibles | Bloquant |
| HTML externe | `scripts/check-html-dependencies.js` | Bloquer dépendances externes non autorisées | Bloquant |
| Stock / TFI | `scripts/check-stock-tfi-rules.js` | Contrôler règles métier stock et exports TFI | Bloquant |
| Qualité HTML | `scripts/check-html-quality.js` | Contrôler title, H1, images alt, viewport | Mixte |
| Fiches projet | `scripts/check-fiche-projet.js` | Vérifier fiches `.md` et `.json` par application HTML | Bloquant |
| Liens HTML | `scripts/check-html-local-links.js` | Vérifier les liens locaux entre modules HTML | Bloquant |
| CSV critiques | `scripts/check-critical-csv.js` | Vérifier templates, mappings, journaux et exports CSV | Mixte |
| Structure | `scripts/check-structure.js` | Vérifier la structure minimale du dépôt | Bloquant |

---

## 4. Tests de non-régression actifs

Avant de contrôler le dépôt réel, la recette teste ses propres détecteurs :

| Test | Script |
|---|---|
| JSON | `scripts/test-json-check.js` |
| Anti-secrets | `scripts/test-no-secrets-check.js` |
| Dépendances HTML | `scripts/test-html-dependencies-check.js` |
| Stock / TFI | `scripts/test-stock-tfi-rules-check.js` |
| Qualité HTML | `scripts/test-html-quality-check.js` |
| Fiche projet | `scripts/test-fiche-projet-check.js` |
| Liens HTML locaux | `scripts/test-html-local-links-check.js` |
| CSV critiques | `scripts/test-critical-csv-check.js` |

Objectif : éviter qu’un détecteur semble fonctionner alors qu’il ne bloque plus les cas dangereux.

---

## 5. Workflows GitHub principaux

| Workflow | Rôle |
|---|---|
| `Recette projet` | Lance la recette complète et publie les rapports |
| `Controle Structure Projet` | Vérifie la structure globale du dépôt |
| `Controle Fiche Projet` | Vérifie les fiches projet obligatoires |
| `Audit HTML Metier` | Vérifie les règles HTML métier |
| `Rapport Global Projet` | Produit une synthèse globale du projet |

---

## 6. Artefacts disponibles dans GitHub Actions

Le workflow `Recette projet` publie :

| Artefact | Fichier source | Utilité |
|---|---|---|
| `rapport-recette` | `rapports/recette/rapport-recette.md` | Synthèse complète de la recette |
| `rapport-liens-html-locaux` | `rapports/liens-html-locaux.md` | Diagnostic des liens locaux HTML |
| `rapport-controle-fiche-projet` | `rapports/controle-fiche-projet.md` | Diagnostic des fiches projet obligatoires |
| `rapport-controle-csv-critiques` | `rapports/controle-csv-critiques.md` | Diagnostic des CSV critiques |

---

## 7. Règles de fusion automatique

Une Pull Request peut être fusionnée automatiquement uniquement si :

- les contrôles GitHub sont visibles ;
- tous les contrôles sont verts ;
- aucun secret n’est exposé ;
- aucun test n’est désactivé pour contourner un problème ;
- aucun changement destructif n’est présent ;
- aucune logique métier centrale n’est modifiée sans test ;
- la modification est limitée et réversible.

Si les contrôles ne sont pas visibles, la fusion est bloquée.

Si un contrôle échoue, la cause doit être corrigée plutôt que contournée.

---

## 8. Zones actuellement bien couvertes

Le dépôt est maintenant bien couvert sur :

- structure projet ;
- JSON ;
- anti-secrets ;
- dépendances HTML externes ;
- qualité HTML minimale ;
- fiches projet obligatoires ;
- liens locaux HTML ;
- règles métier stock / TFI ;
- CSV critiques, templates, mappings, journaux et exports ;
- rapports téléchargeables ;
- tests de non-régression des contrôles.

---

## 9. Zones à améliorer ensuite

Prochaines améliorations recommandées :

1. Ajouter un contrôle des champs obligatoires dans les fichiers exemples métier.
2. Ajouter un contrôle des liens déclarés dans les fiches projet JSON.
3. Ajouter une synthèse automatique des applications HTML disponibles.
4. Ajouter une matrice simple : application → fiche projet → rapports → statut qualité.
5. Ajouter une documentation courte expliquant la différence entre template CSV, mapping CSV, journal CSV et export CSV réel.

---

## 10. Verdict

Le dépôt dispose désormais d’un socle qualité sérieux pour des applications HTML métier locales.

La priorité n’est plus d’ajouter beaucoup de contrôles, mais de :

- garder les contrôles compréhensibles ;
- éviter les fausses alertes inutiles ;
- corriger les vrais écarts détectés ;
- documenter chaque règle ;
- maintenir des cycles courts, testés et réversibles.
