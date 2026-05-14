# Tester la recette GitHub Actions

Version : V1.1  
Projet : Copilote Chef d’Agence

---

## 1. Objectif

Cette notice explique comment tester la recette automatique du dépôt.

La recette contrôle :

- la structure minimale du projet ;
- la validité des fichiers JSON ;
- l’absence de secrets évidents ;
- l’absence de dépendances externes dans les HTML ;
- les règles métier stock / TFI ;
- les tests de non-régression des détecteurs.

---

## 2. Tester depuis GitHub

1. Ouvrir le dépôt GitHub.
2. Aller dans l’onglet `Actions`.
3. Cliquer sur le workflow `Recette projet`.
4. Cliquer sur `Run workflow`.
5. Choisir la branche `main`.
6. Valider.
7. Ouvrir le run lancé.
8. Vérifier si l’étape `Lancer la recette complète` est verte.
9. Télécharger l’artefact `rapport-recette` si disponible.

---

## 3. Rapport automatique

Le workflow génère un rapport Markdown :

```text
rapports/recette/rapport-recette.md
```

Dans GitHub Actions, ce rapport est publié comme artefact nommé :

```text
rapport-recette
```

Il contient :

- la date du contrôle ;
- la branche ;
- le commit ;
- le verdict ;
- la synthèse des contrôles ;
- les derniers logs utiles ;
- l’action recommandée si la recette échoue.

---

## 4. Résultat attendu

Le workflow doit afficher :

```text
Lancer la recette complète      OK
Publier le rapport de recette   OK
```

Dans le rapport, le verdict attendu est :

```text
Verdict : OK
```

---

## 5. Tester en local

Depuis un terminal, à la racine du dépôt :

```bash
node scripts/run-recette-complete.js
```

Cette commande exécute tous les contrôles et génère le rapport localement.

Contrôles unitaires possibles :

```bash
node scripts/test-json-check.js
node scripts/test-no-secrets-check.js
node scripts/test-html-dependencies-check.js
node scripts/test-stock-tfi-rules-check.js
node scripts/check-structure.js
node scripts/check-json.js
node scripts/check-no-secrets.js
node scripts/check-html-dependencies.js
node scripts/check-stock-tfi-rules.js
```

---

## 6. Si le test échoue

### Structure projet

Message possible :

```text
Dossier obligatoire manquant
```

Action : créer le dossier ou corriger son nom.

### JSON invalide

Message possible :

```text
Unexpected token
```

Action : corriger la virgule, l’accolade, le crochet ou le guillemet qui pose problème.

### Secret détecté

Message possible :

```text
Signaux à contrôler
```

Action : vérifier si la ligne contient un vrai secret. Si oui, supprimer. Si c’est une documentation légitime, ajuster le contrôle.

### Dépendance externe HTML

Message possible :

```text
https://...
```

Action : supprimer l’appel externe ou justifier explicitement l’exception.

### Règle métier stock / TFI

Messages possibles :

```text
mini supérieur au maxi
multiple_achat manquant
code_zone_tfi invalide
export PRET_TFI sans validation_humaine
```

Action : corriger la donnée métier, compléter la validation ou bloquer l’export.

---

## 7. Règle de décision

Un test vert ne prouve pas que l’application est parfaite.

Il prouve seulement que les contrôles minimaux passent.

Avant diffusion terrain, il faut toujours faire une recette humaine :

- test mobile ;
- test import ;
- test export ;
- test impression ;
- test données manquantes ;
- test sécurité ;
- validation humaine finale.