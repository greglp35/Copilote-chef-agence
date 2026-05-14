# Tester la recette GitHub Actions

Version : V1.2  
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
- la qualité HTML minimale ;
- les fiches projet obligatoires ;
- les liens locaux HTML ;
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
9. Vérifier si les étapes de publication des rapports sont vertes.
10. Télécharger les artefacts utiles.

---

## 3. Rapports automatiques

Le workflow génère plusieurs rapports Markdown.

### Rapport global de recette

Fichier généré :

```text
rapports/recette/rapport-recette.md
```

Artefact GitHub Actions :

```text
rapport-recette
```

Contenu :

- date du contrôle ;
- branche ;
- commit ;
- verdict ;
- synthèse des contrôles ;
- derniers logs utiles ;
- action recommandée si la recette échoue.

### Rapport des liens HTML locaux

Fichier généré :

```text
rapports/liens-html-locaux.md
```

Artefact GitHub Actions :

```text
rapport-liens-html-locaux
```

Contenu :

- fichiers HTML contrôlés ;
- liens locaux contrôlés ;
- statut des liens par module ;
- liens manquants ;
- avertissements.

### Rapport des fiches projet

Fichier généré :

```text
rapports/controle-fiche-projet.md
```

Artefact GitHub Actions :

```text
rapport-controle-fiche-projet
```

Contenu :

- applications HTML contrôlées ;
- présence des fiches `.md` et `.json` ;
- cohérence des chemins ;
- règles de sécurité ;
- validation humaine ;
- risques bloquants.

---

## 4. Résultat attendu

Le workflow doit afficher :

```text
Lancer la recette complète                         OK
Publier le rapport de recette                      OK
Publier le rapport des liens HTML locaux           OK
Publier le rapport des fiches projet               OK
```

Dans le rapport global, le verdict attendu est :

```text
Verdict : OK
```

---

## 5. Tester en local

Depuis un terminal, à la racine du dépôt :

```bash
node scripts/run-recette-complete.js
```

Cette commande exécute tous les contrôles et génère les rapports localement.

Contrôles unitaires possibles :

```bash
node scripts/test-json-check.js
node scripts/test-no-secrets-check.js
node scripts/test-html-dependencies-check.js
node scripts/test-stock-tfi-rules-check.js
node scripts/test-html-quality-check.js
node scripts/test-fiche-projet-check.js
node scripts/test-html-local-links-check.js
node scripts/check-structure.js
node scripts/check-json.js
node scripts/check-no-secrets.js
node scripts/check-html-dependencies.js
node scripts/check-stock-tfi-rules.js
node scripts/check-html-quality.js
node scripts/check-fiche-projet.js
node scripts/check-html-local-links.js
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

### Qualité HTML

Messages possibles :

```text
un seul <title> attendu
un seul <h1> attendu
image(s) sans attribut alt
```

Action : corriger la structure HTML minimale.

### Fiche projet

Messages possibles :

```text
Fiche Markdown manquante
Fiche JSON manquante
Règle sécurité non validée
Risque bloquant détecté
```

Action : créer ou corriger la fiche projet associée au module HTML.

### Liens HTML locaux

Message possible :

```text
lien local introuvable
```

Action : corriger le chemin du lien ou créer le fichier cible attendu.

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