# Règles de sécurité — Copilote Chef d'Agence

## 1. Règles bloquantes

Les éléments suivants sont interdits dans le dépôt, en particulier dans les fichiers HTML, JavaScript, JSON ou CSV :

- mot de passe ;
- token ;
- clé API ;
- secret client ;
- identifiant AS400 ;
- chaîne ODBC ;
- chaîne de connexion ;
- requête SQL sensible ;
- données clients réelles non anonymisées ;
- export ERP brut contenant des informations sensibles.

## 2. Règle AS400 / ODBC

Le flux cible autorisé est :

```text
AS400 / TFI -> ODBC lecture seule -> extraction sécurisée -> CSV/JSON nettoyé -> application HTML
```

Le HTML ne doit jamais contenir :

- d'identifiant AS400 ;
- de mot de passe ;
- de requête SQL ;
- de chaîne ODBC ;
- d'appel direct à l'ERP.

## 3. Dépendances externes

Par défaut, les applications HTML métier doivent éviter :

- CDN ;
- frameworks distants ;
- polices Google Fonts ;
- icônes externes ;
- appels réseau cachés.

L'objectif est de conserver des outils simples, robustes et exploitables localement.

## 4. Validation humaine

Toute correction, génération ou automatisation proposée par IA ou workflow doit rester soumise à validation humaine avant diffusion.

## 5. Données de test

Les données placées dans `/data` doivent être :

- fictives ;
- anonymisées ;
- limitées au strict nécessaire ;
- sans information client réelle sensible.

## 6. Verdict sécurité

Si une règle bloquante est violée, le workflow doit échouer et le fichier concerné doit être corrigé avant poursuite.
