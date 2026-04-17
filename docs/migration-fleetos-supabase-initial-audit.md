# Audit initial — Migration FleetOS vers Supabase

Date: 2026-04-17

## Constat repo
- Le dépôt présent ne contient pas l'application front HTML/CSS/JS FleetOS complète.
- Aucun usage `localStorage` ou faux login n'est détectable dans les fichiers existants (principalement documentation).
- Le document demandé `docs/migration-fleetos-supabase-complete.html` n'existait pas ; une version bootstrap a été ajoutée comme référence de cadrage.

## Hypothèses explicites
1. Le code applicatif FleetOS vit dans un autre dépôt ou une autre branche non fournie ici.
2. L'intégration réalisée dans `src/` constitue une première couche réutilisable à brancher dans l'UI existante.
3. Les tables `profiles` et `memberships` existent déjà côté Supabase avec RLS activée.

## Plan de migration incrémentale (minimal)
1. Brancher `bootstrapAuthContext()` au démarrage du front existant.
2. Remplacer les lectures de faux login local par `window.FleetOSAuth.session/profile`.
3. Remplacer l'agence active locale par `window.FleetOSAuth.activeAgencyId`.
4. Sécuriser les composants UI avec `window.FleetOSAuth.permissions`.
5. Migrer écran par écran le CRUD vers Supabase, en conservant un fallback mocké temporaire.

## Risques
- Sans branchement runtime dans l'app FleetOS réelle, cette étape reste préparatoire.
- Si le schéma Supabase diffère (`profiles`/`memberships`), adapter les requêtes.
- Si la politique RLS est incomplète, certains écrans peuvent paraître “vides” malgré session valide.

## Étape modules métier — hypothèses de schéma (2026-04-17)
- `shared_tournee_feed` utilise `producer_agency_id` et `consumer_agency_id`.
- `interagency_slot_requests` utilise `requester_agency_id` et `target_agency_id`.
- Ces noms doivent être alignés avec le schéma SQL réel ; sinon adapter les repositories sans changer la logique de sécurité.
