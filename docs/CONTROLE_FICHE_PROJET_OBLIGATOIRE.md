# Contrôle fiche projet obligatoire

Version : V1.0  
Projet : Copilote Chef d’Agence  
Statut : règle qualité existante documentée

---

## 1. Objectif

Chaque application HTML métier placée dans `/src` doit être accompagnée d’une fiche projet lisible et d’une fiche projet structurée.

Cette règle évite qu’un fichier HTML existe sans cadrage métier, sans règles de sécurité, sans validation humaine et sans objectif opérationnel clair.

---

## 2. Workflow existant

Le dépôt contient déjà un workflow dédié :

```text
.github/workflows/controle-fiche-projet.yml
```

Ce workflow vérifie les applications HTML présentes dans `/src` et contrôle la présence des fichiers associés dans `/projets`.

Exemple attendu :

```text
src/stock-mini-maxi.html
projets/stock-mini-maxi.md
projets/stock-mini-maxi.json
```

---

## 3. Règle obligatoire

Pour chaque fichier :

```text
src/<nom-application>.html
```

Il faut :

```text
projets/<nom-application>.md
projets/<nom-application>.json
```

Le Markdown sert à la lecture humaine.

Le JSON sert au contrôle automatisé et à la reprise par IA, Codex ou un développeur.

---

## 4. Points contrôlés

Le workflow vérifie notamment :

- existence de la fiche Markdown ;
- existence de la fiche JSON ;
- validité du JSON ;
- cohérence du `project_id` ;
- cohérence des chemins déclarés dans `source_files` ;
- présence des règles de sécurité ;
- validation humaine ;
- absence de risque bloquant ;
- présence d’un objectif métier exploitable.

---

## 5. Champs JSON importants

Une fiche projet JSON doit décrire au minimum :

```text
schema_version
project_id
project_name
status
created_at
updated_at
owner
validator
problem_to_solve
target_users
operational_goal
source_files
data_sources
security_rules
expected_features
out_of_scope
success_criteria
risks
human_validation
next_actions
```

---

## 6. Règles de sécurité attendues

Les règles suivantes doivent être confirmées :

```text
no_password_in_html
no_token_in_html
no_as400_credentials_in_html
no_odbc_string_in_html
no_sensitive_sql_in_html
test_data_only
human_validation_required
```

---

## 7. Décision de validation

La validation humaine doit être explicite.

Décisions autorisées :

```text
pending
validated
needs_correction
blocked
```

Un module en risque `blocking` ne doit pas être considéré comme diffusable.

---

## 8. Pourquoi ce contrôle est important

Un HTML métier peut fonctionner techniquement tout en étant dangereux ou inutile si son cadrage est absent.

La fiche projet permet de savoir :

- pourquoi l’outil existe ;
- qui l’utilise ;
- quelles données sont utilisées ;
- quelles limites sont assumées ;
- quelles règles de sécurité sont bloquantes ;
- quelle validation humaine est prévue.

---

## 9. Règle de décision

Aucune application HTML métier ne doit être considérée comme stable si elle n’a pas sa fiche projet associée.

La création du fichier HTML et la création de la fiche projet doivent avancer ensemble.

---

## 10. Prochaine amélioration possible

Le workflow existant contrôle déjà les fiches projet. Une évolution future utile serait d’extraire sa logique dans un script réutilisable :

```text
scripts/check-fiche-projet.js
scripts/test-fiche-projet-check.js
```

Cela permettrait d’intégrer ce contrôle directement dans la recette complète et de le tester avec des cas de non-régression.