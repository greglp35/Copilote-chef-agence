# Architecture cible — Applications HTML métier

Version : 1.0  
Statut : architecture de référence à valider module par module

## 1. Principes

- ERP TFI/MTX : vérité officielle métier.
- Excel SharePoint maître : base centrale d'écriture V1 pour les modules validés.
- HTML : interface de saisie, contrôle, pilotage, import et export.
- JSON : sauvegarde technique, transport et restauration, jamais vérité métier autonome.
- Aucune écriture directe vers l'ERP.
- Aucun secret, token ou identifiant sensible dans le front.
- Toute action critique reste confirmée et traçable.

## 2. Couches recommandées

```text
Interface HTML sémantique
  ├─ Composants accessibles
  ├─ Formulaires et tableaux métier
  └─ Messages d'état et confirmations

Services applicatifs JavaScript
  ├─ règles métier
  ├─ validation des droits
  ├─ journalisation
  ├─ gestion des statuts
  └─ orchestrateur import/export

Couche données
  ├─ modèles JSON versionnés
  ├─ validation Ajv
  ├─ stockage local Dexie si nécessaire
  └─ sauvegarde/restauration JSON

Adaptateurs fichiers
  ├─ CSV : Papa Parse
  ├─ XLSX : ExcelJS
  ├─ fichiers : browser-fs-access
  └─ PDF/QR selon besoin validé

Connecteur Microsoft V2
  ├─ MSAL Browser
  ├─ Microsoft Graph
  ├─ permissions déléguées
  ├─ gestion ETag/concurrence
  └─ audit des écritures

Qualité
  ├─ Playwright
  ├─ axe-core
  ├─ Lighthouse CI
  ├─ contrôles secrets/dépendances
  └─ recette humaine
```

## 3. Arborescence cible

```text
/src/<module>/
  index.html
  assets/
  css/
    app.css
    print.css
  js/
    app.js
    config.js
    domain/
      rules.js
      statuses.js
      permissions.js
    data/
      repository.js
      migrations.js
    adapters/
      csv-adapter.js
      excel-adapter.js
      file-adapter.js
      graph-adapter.js
    ui/
      forms.js
      tables.js
      dialogs.js
      notifications.js

/data/schemas/<module>/
/data/examples/<module>/
/tests/<module>/
/docs/<module>/
/rapports/<module>/
/vendor/<bibliotheque>/<version>/
```

## 4. Flux V1 — Excel SharePoint contrôlé

1. L'utilisateur ouvre ou importe une copie contrôlée du classeur.
2. L'application vérifie le nom des feuilles, tables, colonnes et version de schéma.
3. Une prévisualisation affiche ajouts, modifications, doublons et erreurs.
4. L'utilisateur confirme l'opération.
5. L'application génère un XLSX ou CSV conforme au mapping validé.
6. L'utilisateur dépose ou remplace le fichier dans SharePoint selon la procédure interne.
7. L'opération est inscrite dans le journal d'audit local/exporté.

Ce flux limite les risques de droits, de concurrence et d'authentification pendant la V1.

## 5. Flux V2 — Microsoft Graph

1. Application servie en HTTPS.
2. Authentification interactive via MSAL et Entra ID.
3. Lecture du classeur et de la table ciblée via Graph.
4. Vérification de la version et de l'état courant.
5. Prévisualisation des changements.
6. Confirmation humaine.
7. Écriture transactionnelle limitée à la table autorisée.
8. Contrôle de la réponse, reprise sur erreur et journalisation.
9. Déconnexion et nettoyage des données temporaires.

## 6. Données et sécurité

- Les données importées sont considérées non fiables jusqu'à validation.
- Les cellules de formules CSV doivent être neutralisées lors des exports destinés à Excel.
- Les champs texte sont affichés avec `textContent` par défaut.
- DOMPurify est réservé au contenu HTML réellement nécessaire.
- Les droits doivent être contrôlés dans l'interface et dans le service distant lorsque celui-ci existe.
- Le journal d'audit ne doit pas contenir de données personnelles inutiles.
- Les sauvegardes doivent être datées, versionnées et restaurables.

## 7. Résilience

Chaque module doit prévoir :

- sauvegarde locale ou export de secours ;
- message explicite en cas d'échec ;
- absence de perte silencieuse ;
- reprise après fermeture du navigateur ;
- gestion des doublons ;
- migrations de schéma testées ;
- restauration d'une version précédente ;
- fonctionnement dégradé clairement signalé.

## 8. Interdictions

- écriture directe AS400/TFI depuis le navigateur ;
- secret Microsoft ou clé API dans le dépôt ;
- synchronisation cachée ;
- suppression définitive sans confirmation et journal ;
- modification automatique de la structure du classeur maître ;
- décision métier automatique sans validation humaine ;
- CDN de production non approuvé.