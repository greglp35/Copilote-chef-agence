# FleetOS — CODEX PLAN (migration progressive Supabase)

Date: 2026-04-17

## 1) Audit synthétique (état actuel)

### localStorage détecté
- `fleetos_current_agency_id` (contexte agence active).
- `fleetos_user_context` (fallback contextuel temporaire).
- `fleetos_missions`, `fleetos_tournees`, `fleetos_tournee_missions`, `fleetos_drivers`, `fleetos_vehicles` (fallback métier transitoire).

### mocks / fallbacks
- Fallback contexte utilisateur en cas d'indisponibilité Supabase.
- Fallback métier localStorage dans `fleetDataGateway` sur erreurs non-RLS.

### rôles locaux
- Permissions UI calculées localement à partir des `memberships` Supabase (`viewer` → `owner`).
- Pas de source de vérité locale pour auth/session (Supabase-first).

### points de couplage forts
- Accès direct à `localStorage` réparti dans plusieurs modules.
- Fallback métier encore présent dans la couche data gateway.

## 2) Proposition courte (première étape)
- **Étape 1 implémentée ici** : centraliser tous les accès localStorage via un adaptateur unique (`browserStorage`) pour réduire le couplage et préparer la suppression progressive du mode local.
- Conserver les fallback actuels (stabilité UI), mais instrumenter l'usage pour pilotage de suppression.

## 3) Arborescence cible minimale
- `src/integrations/supabase/*` : client + accès Supabase.
- `src/auth/*` : session/profile/memberships/current_agency_id/permissions.
- `src/data/modules/*` : repositories CRUD agence-scopés.
- `src/data/network/*` : partage inter-agences.
- `src/realtime/*` : abonnements ciblés.
- `src/platform/browserStorage.js` : unique point d'accès storage temporaire.

## 4) Prochaine étape claire
- remplacer dans l'UI existante les lectures directes du localStorage métier par les repositories/gateway Supabase-first puis désactiver `VITE_ENABLE_LEGACY_BUSINESS_LOCALSTORAGE` en staging.
