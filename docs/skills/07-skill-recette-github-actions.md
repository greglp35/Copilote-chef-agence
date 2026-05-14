# Skill 07 — Recette et GitHub Actions

Version : V1.0  
Statut : compétence de fiabilisation  
Projet : Copilote Chef d’Agence  
Usage : contrôler automatiquement la structure, la sécurité et la qualité minimale des fichiers avant diffusion.

---

## 1. Objectif

Ce skill sert à mettre en place une recette simple pour éviter qu’un fichier HTML, JSON, CSV ou Markdown dangereux ou incohérent soit considéré comme valide.

L’objectif n’est pas de créer une usine à gaz DevOps. L’objectif est d’avoir quelques contrôles automatiques utiles et compréhensibles.

---

## 2. Contrôles prioritaires

À automatiser en priorité :

- présence des dossiers clés ;
- absence de secrets évidents ;
- validation JSON ;
- cohérence des noms de fichiers ;
- absence de dépendances externes non autorisées ;
- présence d’un fichier exemple si schéma présent ;
- présence d’une fiche projet pour chaque application ;
- contrôle basique HTML ;
- contrôle des exports non sensibles ;
- rapport de recette généré.

---

## 3. Structure recommandée

```text
.github/workflows/recette-projet.yml
scripts/check-structure.js
scripts/check-no-secrets.js
scripts/check-json.js
rapports/recette/
```

Si le projet reste 100 % HTML/JSON sans environnement Node, les scripts peuvent être remplacés par des contrôles simples documentés.

---

## 4. Règles de recette minimales

Un module est validable si :

- son fichier source existe dans `/src` ;
- sa fiche projet existe dans `/projets` ;
- ses données exemples existent dans `/data` si nécessaire ;
- ses schémas sont valides ;
- il ne contient pas de secret ;
- il respecte les règles de sécurité ;
- il fonctionne sans dépendance externe non validée ;
- il a été testé sur mobile ;
- la validation humaine est documentée.

---

## 5. Contrôle anti-secrets

Rechercher au minimum :

```text
password
token
secret
api_key
apikey
client_secret
ODBC
AS400
SQL
connectionString
login
```

Attention : la présence d’un mot ne prouve pas toujours un secret. Le contrôle doit signaler pour vérification humaine.

---

## 6. Checklist qualité

Avant merge ou diffusion :

- les fichiers ajoutés sont au bon endroit ;
- les noms sont propres ;
- les exemples sont fictifs ;
- les schémas JSON se lisent ;
- les imports/exports sont documentés ;
- aucun secret n’est détecté ;
- aucun CDN non autorisé n’est ajouté ;
- le README ou la fiche projet est à jour ;
- un rapport ou une note de recette existe.

---

## 7. Anti-patterns à refuser

À éviter :

- valider uniquement parce que “ça s’affiche” ;
- ne pas tester les imports ;
- ne pas tester les exports ;
- ignorer les erreurs console ;
- ajouter une librairie externe pour un petit besoin ;
- ignorer les données sensibles ;
- publier sans fiche projet ;
- absence de traçabilité des corrections.

---

## 8. Prompt court pour Codex

```text
Prépare une recette GitHub Actions simple pour ce dépôt HTML métier. Contrôle la structure, les JSON, l’absence de secrets, les dépendances externes, les fichiers exemples, les fiches projet et la présence d’un rapport de validation. Ne crée pas une usine DevOps : reste simple, local et compréhensible.
```

---

## 9. Verdict attendu

La recette est acceptable si elle bloque les erreurs critiques sans ralentir inutilement la production des outils métier.