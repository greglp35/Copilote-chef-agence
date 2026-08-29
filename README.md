# Copilote-chef-agence
Assistant IA pour le pilotage d'une agence tout faire matériaux automatisation to do analyse et support 

## Socle projet Copilote Chef d'Agence

Ce dépôt sert de base de travail pour le projet **Copilote Chef d'Agence**.

Objectif : construire progressivement une base robuste pour des applications HTML métier, des workflows de contrôle, des rapports d'audit, des modèles de données et des assistants IA utiles au pilotage d'une agence de négoce de matériaux.

Principes prioritaires :

- sécurité avant automatisation ;
- validation humaine obligatoire avant diffusion ou mise en production ;
- zéro dépendance externe par défaut pour les applications HTML métier ;
- aucun secret, token, mot de passe, identifiant AS400, chaîne ODBC ou requête SQL sensible dans le HTML ;
- séparation entre sources, données, exports, rapports et documentation ;
- traçabilité des décisions et des corrections.

## Structure projet cible

```text
/docs       Documentation, règles, dossiers de référence
/src        Sources applicatives HTML/CSS/JS
/templates  Modèles réutilisables
/exports    Exports générés ou exemples non sensibles
/rapports   Rapports d'audit et de contrôle
/data       Schémas JSON/CSV et données de test non sensibles
```

## HTML “Claude‑IA friendly”

Règles à appliquer par défaut dans tout code HTML généré ou corrigé :

1) Sémantique  
   - Utiliser : header, nav, main, article, section, footer, plutôt que div.  
   - Un seul H1 par page, hiérarchie H2–H3–H4 cohérente.  

2) Accessibilité basique  
   - Tous les <img> doivent avoir un alt explicite.  
   - Les boutons/liens doivent avoir un texte clair.  

3) Balises pour l’IA et les moteurs  
   - <title> unique et descriptif.  
   - <meta name="description"> approprié.  
   - Schema.org en JSON‑LD si demandé (Organization, Product, Article, FAQ, etc.).  

4) Traçabilité  
   - Ajouter des commentaires dans le HTML :  
     - <!-- AUDIT SEO / IA : [mot‑clé] -->  
     - <!-- MAJ : [date] - changement depuis Screaming Frog report X -->  

## Audit HTML avec Screaming Frog

Quand l'utilisateur demande un audit HTML avec Screaming Frog, suis ce canevas :

1) Demande d’information initiale  
   - Si l’URL n’est pas fournie, demander :  
     - URL racine du site.  
     - Type de site (corporate, e‑commerce, blog, etc.).  
     - Version du plan Claude (Pro / Max).  

2) Analyse des onglets Screaming Frog  
   Pour chaque onglet, produire :  
   - Une **liste structurée** des problèmes.  
   - Des **recommandations** sous forme de code HTML ou de consignes CMS.  

2.1) Overview  
   - Identifier :  
     - Nombre d’URLs.  
     - % de pages ayant des erreurs métas / H1.  
   - Interpréter :  
     - “Ce site a X % de pages sans H1 : c’est un problème de structure sémantique.”

2.2) Page Titles / Meta Description  
   - Sortie :  
     - Tableau (CSV) : URL, status (absent / dupliqué / bon), nouvelle valeur recommandée.  

2.3) Headings  
   - Sortie :  
     - Lister :  
       - Pages sans H1.  
       - Pages avec plusieurs H1.  
       - Hiérarchies H1–H2–H3 incohérentes.  

2.4) Images  
   - Sortie :  
     - CSV : URL, src de l’image, alt actuel, alt recommandé.  

2.5) Response Codes  
   - Trier les erreurs par type : 404, 500, redirections en chaîne.  
   - Proposer :  
     - Supprimer, corriger ou rediriger.  

3) Format de livrable  
   - Toujours :  
     - Séparer en sections (Overview, Titles, Headings, Images, Links, Errors).  
     - Donner un exemple de HTML corrigé pour chaque type de problème.  
     - Proposer un **template de CSV** à exporter dans Screaming Frog / Excel.  

## Travail avec Claude sur l’HTML

1. PLAN (diagnostic)  
   - Liste tous les problèmes détectés dans Screaming Frog (erreurs, alertes, warnings).  
   - Ordonne les problèmes par priorité :  
     - Sécurité / breaking bugs (404 critiques, canonicité cassée).  
     - SEO / IA (titres, H1, meta, schema).  
     - UX / accessibilité (balises sémantiques, images, contrastes).  

2. EXECUTE (actions concrètes)  
   - Pour chaque point :  
     - Donner :  
       - URL cible.  
       - type d’erreur (ex. “H1 manquant”).  
       - recommandation précise (ex. “Ajoute un H1 unique avec phrase clé : ‘…’”).  
     - Proposer un **code HTML** exact à injecter / modifier.  

3. VERIFY (traçabilité)  
   - Fournir un **rapport de suivi** :  
     - “Before” / “After” HTML.  
     - Date, version du projet.  
   - Si possible, exporter un CSV compatible avec Screaming Frog (colonnes : URL, type_problème, recommandation, priorité).

# Cadre : audit et optimisation HTML avec Screaming Frog

Objectif :  
- Aider [ton nom / ton équipe] à auditer et corriger le HTML de [nom du site] (site e‑commerce, corporatif, blog, etc.).  
- Produire des recommandations claires, traçables et exécutables pour Claude.  
- Fournir un format structuré (liste, CSV, rapports) utilisable directement dans Screaming Frog, Excel ou le CMS.
## Migration FleetOS → Supabase (étape auth + contexte utilisateur)

Cette étape introduit une couche d'authentification/contexte Supabase compatible avec une migration incrémentale.

### Fichiers ajoutés
- `docs/migration-fleetos-supabase-complete.html` : référence d'architecture cible (bootstrap).
- `src/integrations/supabase/supabaseClient.js` : initialisation client Supabase (avec fallback sûr).
- `src/auth/sessionService.js` : récupération session + écoute changements de session.
- `src/auth/userContextService.js` : chargement `profile` + `memberships`.
- `src/auth/activeAgencyService.js` : résolution/persistance de l'agence active.
- `src/auth/permissions.js` : helpers d'autorisation UI basés rôle.
- `src/ui/bootstrapAuthContext.js` : pont d'intégration UI existante (`window.FleetOSAuth`).
- `.env.example` : variables d'environnement front.

### Notes provisoires
- Fallback legacy local conservé pour éviter de casser les écrans non migrés.
- Les vues encore mockées peuvent continuer à fonctionner ; elles doivent migrer ensuite vers une couche CRUD Supabase agence-scopée.
- Le dépôt actuel étant orienté documentation, l'intégration runtime (import modules, bundler, hooks UI) doit être branchée dans le projet FleetOS applicatif.

## Migration FleetOS → Supabase (étape modules métier)

Branchement initial des modules métier sur Supabase, en respectant `memberships + current_agency_id` et les contraintes inter-agences.

### Modules branchés
1. `missions` (CRUD agence active)
2. `tournees` (CRUD agence active)
3. `tournee_missions` (CRUD agence active)
4. `shared_tournee_feed` (visibilité inter-agences limitée, publication/révocation)
5. `interagency_slot_requests` (requêtes inter-agences visibles uniquement pour agence requester/target)

### Garanties sécurité
- Validation systématique du scope agence active contre les memberships actifs.
- Filtrage agence obligatoire sur tous les accès CRUD standards.
- Normalisation des erreurs RLS (`RLS_FORBIDDEN`) pour affichage UI propre.
- Colonnes sélectionnées minimales sur les vues inter-agences (pas d'exposition des champs internes non nécessaires).

### Temps réel (préparation)
Chaque repository expose `realtimeChannelName(activeAgencyId)` pour brancher Supabase Realtime ensuite.

## Migration FleetOS → Supabase (stabilisation Auth)

Cette étape retire le faux login local comme source de vérité:
- session = Supabase Auth uniquement ;
- fallback local limité au contexte UI (optionnel) pour compatibilité temporaire.

### Priorité current_agency_id
1. `profiles.current_agency_id`
2. préférence locale temporaire (`fleetos_current_agency_id`)
3. premier membership actif

### Fallback temporaire documenté
- `window.__FLEETOS_ENABLE_LEGACY_CONTEXT_FALLBACK__ !== false` autorise la lecture de `fleetos_user_context` uniquement si Supabase n'est pas joignable.
- Ce fallback est transitoire, à supprimer après migration complète des écrans.

## Migration FleetOS → Supabase (étape modules métier v2)

Entités migrées en priorité Supabase:
1. `missions`
2. `tournees`
3. `tournee_missions`
4. `drivers`
5. `vehicles`

### Couche d'accès
- Repositories agence-scopés par entité (`src/data/modules/*Repository.js`).
- `fleetDataGateway` pour lecture unifiée et fallback local temporaire contrôlé.
- Filtrage local systématique par `activeAgencyId` en mode dégradé.

### Erreurs d'accès
- Les erreurs RLS restent explicites (`RLS_FORBIDDEN`) et ne basculent pas en local.
- Les autres erreurs passent en fallback local temporaire pour stabilité UI.

## Migration FleetOS → Supabase (visibilité inter-agences)

### Règles de partage appliquées
- Niveau par défaut : `availability_only`.
- `schedule_summary` et `dispatch_collaboration` ne sont exposés que si le niveau partagé l'autorise.
- Interdiction de lecture directe des missions internes d'une autre agence.

### Implémentation
- `sharedTourneeFeedRepository.listVisible()` applique une sanitization selon niveau demandé.
- `interagencySlotRequestsRepository.askForSupport()` permet de demander un créneau ou une aide inter-agences.
- `networkAvailabilityPanel` fournit un panneau UI minimal “Disponibilités réseau”.

## Migration FleetOS → Supabase (temps réel)

### Abonnements retenus (minimum utile)
- `planning` agence active: `missions`, `tournees`, `tournee_missions` filtrés par `agency_id`.
- `shared_tournee_feed`: rafraîchissement seulement si `producer_agency_id` ou `consumer_agency_id` concerne l'agence active.
- `interagency_slot_requests`: rafraîchissement seulement si `requester_agency_id` ou `target_agency_id` concerne l'agence active.

### Choix techniques
- Coalescence des événements via debounce (300ms) pour éviter les rechargements complets inutiles.
- 3 canaux realtime au total (pas de sur-abonnement table par table côté écran).
- API simple: `createFleetRealtimeManager(...)` + `bootstrapRealtime(...)`.

### Limites connues
- Pas de merge granulaire des lignes: on déclenche des refresh ciblés (planning/feed/requests).
- En cas de perte réseau, la reconnexion est laissée au client Supabase JS.

## Migration FleetOS → Supabase (étape 1 audit + découplage storage)

### Audit rapide confirmé
- `localStorage` encore utilisé pour les fallbacks (`fleetos_user_context`, `fleetos_current_agency_id`, et entités métier fallback).
- Rôles UI calculés localement mais issus des `memberships` Supabase.
- Source session/auth = Supabase (plus de faux login source de vérité).

### Première étape implémentée
- Centralisation des accès `localStorage` via `src/platform/browserStorage.js`.
- Migration des modules critiques (`activeAgencyService`, `userContextService`, `localFleetStore`) vers cet adaptateur.
- Objectif: réduire le couplage au navigateur et préparer la suppression progressive du mode local métier.
