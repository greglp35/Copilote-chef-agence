# Tester la recette GitHub Actions

Version : V1.0  
Projet : Copilote Chef d’Agence

---

## 1. Objectif

Cette notice explique comment tester la recette automatique du dépôt.

La recette contrôle :

- la structure minimale du projet ;
- la validité des fichiers JSON ;
- l’absence de secrets évidents ;
- l’absence de dépendances externes dans les HTML.

---

## 2. Tester depuis GitHub

1. Ouvrir le dépôt GitHub.
2. Aller dans l’onglet `Actions`.
3. Cliquer sur le workflow `Recette projet`.
4. Cliquer sur `Run workflow`.
5. Choisir la branche `main`.
6. Valider.
7. Ouvrir le run lancé.
8. Vérifier si toutes les étapes sont vertes.

---

## 3. Résultat attendu

Le workflow doit afficher :

```text
Contrôler la structure projet      OK
Contrôler les fichiers JSON        OK
Contrôler l’absence de secrets     OK
Contrôler les dépendances HTML     OK
```

---

## 4. Tester en local

Depuis un terminal, à la racine du dépôt :

```bash
node scripts/check-structure.js
node scripts/check-json.js
node scripts/check-no-secrets.js
node scripts/check-html-dependencies.js
```

---

## 5. Si le test échoue

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

---

## 6. Règle de décision

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