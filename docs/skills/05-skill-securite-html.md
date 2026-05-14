# Skill 05 — Sécurité HTML et anti-secrets

Version : V1.0  
Statut : compétence bloquante  
Projet : Copilote Chef d’Agence  
Usage : sécuriser les applications HTML métier locales et éviter les erreurs dangereuses.

---

## 1. Objectif

Ce skill sert à empêcher l’intégration de données sensibles, d’identifiants ou de mécanismes dangereux dans les fichiers HTML, JSON, CSV ou exemples du dépôt.

La sécurité est prioritaire sur l’automatisation.

---

## 2. Règles bloquantes

Interdit dans le HTML :

- mot de passe ;
- token ;
- clé API ;
- identifiant AS400 ;
- chaîne ODBC ;
- requête SQL sensible ;
- accès direct ERP ;
- lien d’écriture automatique vers TFI ;
- données client sensibles ;
- prix confidentiels non anonymisés ;
- données RH nominatives non nécessaires.

---

## 3. Principe de séparation

```text
HTML       → affiche, contrôle, aide à décider
JSON/CSV   → transporte des données nettoyées ou fictives
Docs       → explique les règles
Exports    → prépare des fichiers contrôlés
ERP/AS400   → reste source de vérité externe, non modifiée par le HTML
Humain     → valide avant action sensible
```

---

## 4. Contrôles à faire

Avant diffusion :

- rechercher les mots `password`, `token`, `secret`, `apiKey`, `ODBC`, `AS400`, `SQL`, `user`, `login` ;
- vérifier qu’aucun accès réseau caché n’existe ;
- vérifier qu’aucune donnée réelle sensible n’est dans les exemples ;
- vérifier que les exports sont marqués comme contrôles ou propositions ;
- vérifier que la validation humaine est visible ;
- vérifier que les actions critiques ne sont pas automatiques.

---

## 5. Statuts de sécurité recommandés

```text
SECURITE_OK
A_CONTROLER
BLOQUE_SECRET_DETECTE
BLOQUE_DONNEE_SENSIBLE
BLOQUE_ACTION_AUTOMATIQUE
BLOQUE_CONNEXION_ERP
```

---

## 6. Checklist qualité

Un module est diffusable si :

- aucun secret n’est présent ;
- aucun identifiant système n’est présent ;
- aucune écriture ERP n’est possible ;
- les données d’exemple sont fictives ;
- les exports sont contrôlables ;
- la validation humaine est obligatoire ;
- les limites de l’outil sont indiquées ;
- le rôle du HTML est limité à l’aide à la décision.

---

## 7. Anti-patterns à refuser

À éviter :

- stocker un mot de passe dans localStorage ;
- intégrer une clé API dans le JS ;
- faire une requête SQL depuis le navigateur ;
- créer un bouton “envoyer vers TFI” sans validation forte ;
- mélanger données réelles et données test ;
- masquer les limites de l’application ;
- faire croire qu’une proposition IA est une décision validée.

---

## 8. Prompt court pour Codex

```text
Audite ce dépôt ou ce fichier HTML sous l’angle sécurité. Recherche secrets, tokens, mots de passe, identifiants AS400, chaînes ODBC, requêtes SQL, données sensibles, appels réseau cachés, écritures ERP et actions automatiques. Bloque tout risque critique et propose une correction locale simple.
```

---

## 9. Verdict attendu

Un outil est acceptable seulement si la sécurité est maîtrisée avant toute automatisation.