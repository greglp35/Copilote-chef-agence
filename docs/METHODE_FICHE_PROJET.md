# Méthode — Fiche Projet Obligatoire

## 1. Principe

Aucune application HTML métier ne doit être créée, modifiée ou diffusée sans fiche projet associée.

Cette règle évite de produire des outils sans cadrage, sans objectif clair, sans contrôle de sécurité ou sans validation humaine.

## 2. Règle de base

Pour chaque fichier HTML placé dans `/src`, il doit exister :

```text
projets/[nom-du-fichier].md
projets/[nom-du-fichier].json
```

Exemple :

```text
src/stock-mini-maxi.html
projets/stock-mini-maxi.md
projets/stock-mini-maxi.json
```

## 3. Rôle de la fiche Markdown

La fiche `.md` sert à la lecture humaine.

Elle doit expliquer :

- le problème terrain ;
- l'utilisateur cible ;
- l'objectif opérationnel ;
- les données utilisées ;
- les règles de sécurité ;
- les fonctionnalités attendues ;
- les critères de réussite ;
- les risques ;
- la validation humaine.

## 4. Rôle de la fiche JSON

La fiche `.json` sert au contrôle automatique.

Elle doit contenir une structure exploitable par GitHub Actions, un futur cockpit ou un assistant IA.

## 5. Statuts autorisés

Les statuts projet recommandés sont :

```text
draft
in_review
validated
blocked
archived
```

## 6. Niveaux de risque

Les niveaux de risque recommandés sont :

```text
low
medium
high
blocking
```

Un projet avec risque `blocking` ne doit pas être diffusé.

## 7. Sécurité

La fiche projet doit confirmer les règles suivantes :

- aucun mot de passe dans le HTML ;
- aucun token dans le HTML ;
- aucun identifiant AS400 ;
- aucune chaîne ODBC ;
- aucune requête SQL sensible ;
- données fictives ou anonymisées ;
- validation humaine obligatoire.

## 8. Workflow de contrôle

Le workflow `Controle Fiche Projet` vérifie :

- présence du dossier `/projets` ;
- présence d'une fiche Markdown pour chaque HTML ;
- présence d'une fiche JSON pour chaque HTML ;
- validité du JSON ;
- champs obligatoires ;
- règles de sécurité ;
- cohérence des chemins source ;
- statut projet ;
- risques bloquants.

## 9. Décision senior

La fiche projet ne doit pas devenir une formalité administrative.

Elle doit répondre à une question simple :

> Est-ce que cet outil mérite vraiment d'exister, et peut-il être utilisé sans risque ?

## 10. Processus recommandé

1. Créer la fiche projet à partir du template.
2. Créer le JSON projet correspondant.
3. Créer ou modifier le HTML dans `/src`.
4. Lancer le workflow `Controle Fiche Projet`.
5. Lancer `Recette Application HTML`.
6. Lire le `Rapport Global Projet`.
7. Valider humainement avant diffusion.
