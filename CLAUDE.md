# CLAUDE.md — Copilote Chef d'Agence (DMA DJ)

## Vue d'ensemble du projet

Ce dépôt est un **référentiel de spécifications et de gouvernance** pour **DMA DJ — Copilote Chef d'Agence**, un assistant IA dédié au pilotage d'une agence tout-faire matériaux & automatisation. Il ne contient **pas de code source** : c'est un système de documentation vivante, versionné, qui décrit les règles métier, l'architecture fonctionnelle et la gouvernance du système.

- **Version actuelle** : MVP v1.1 (figée — usage terrain réel)
- **Langue de travail** : Français
- **Date de clôture v1.1** : 23 mars 2026
- **Prochaine version** : v1.2 (consolidation), puis v2 (évolutions structurelles)

---

## Structure du dépôt

```
Copilote-chef-agence/
├── 00_Pilotage système/        → Gouvernance, navigation, règles d'usage
│   └── README_DMA_DJ.md
├── 01_Règles validées/         → Règles métier validées — LECTURE SEULE sans accord
│   └── 37_regles_assistant_metier_central_validees.md
├── 02_Clôture versions/        → Rapports officiels de clôture de version
│   └── 38_cloture_version_systeme_dma_dj.md
├── 03_Retours terrain/         → Journal de terrain, incidents, observations
│   └── 39_retours_usage_terrain_v1.md
├── 04_Backlog V2/              → Idées futures (aucun engagement de réalisation)
│   └── 40_backlog_v2_dma_dj.md
├── CLAUDE.md                   → Ce fichier
├── README.md                   → Description rapide du projet
└── LICENSE                     → MIT 2025
```

### Convention de nommage des fichiers

Les fichiers suivent la convention `NN_description_titre.md` où `NN` est un numéro de séquence global. Les fichiers 24–40 couvrent les différents modules et spécifications. Des fichiers référencés (28, 32, 33, 35, etc.) définissent des contrats cross-modules et peuvent exister dans d'autres emplacements du système.

---

## Architecture fonctionnelle du système

Le système DMA DJ implémente une architecture **hub-and-spoke** autour d'un stockage centralisé (`dma_dossiers` en `localStorage`).

### 8 modules livrés (MVP v1.1)

| # | Module | Identifiant | Rôle | Fichier de règles |
|---|---|---|---|---|
| 1 | Configurateur de devis | `configurateur` | Crée les dossiers et génère `id_dossier` | `24_regles_configurateur_devis_validees.md` |
| 2 | Suivi commercial & paiements | `suivi` | Gère `statut_commercial` et encaissements | `25_regles_suivi_commercial_paiements_validees.md` |
| 3 | Préparateur de prestation | `preparateur` | Prépare l'événement, calcule `score_completude` | `26_regles_preparateur_prestation_validees.md` |
| 4 | Dashboard KPI | `dashboard` | Lecture et agrégation — jamais recalcul | `27_regles_dashboard_kpi_validees.md` |
| 5 | Fiche client intelligente | `fiche_client` | Vue synthétique transversale d'un dossier | `35_regles_fiche_client_intelligente_validees.md` |
| 6 | Checklist Jour J | `checklist` | Validation terrain le jour de l'événement | — |
| 7 | Conducteur de soirée | `conducteur` | Déroulé en temps réel le soir J | — |
| 8 | Assistant métier central | `assistant` | Hub de navigation et recommandation | `37_regles_assistant_metier_central_validees.md` |

### Flux de données (sens unique)

```
Configurateur → dma_dossiers → Suivi → dma_dossiers → Préparateur → dma_dossiers
                                                                          ↓
                                         Dashboard / Fiche client / Assistant (lecture seule)
```

L'**Assistant Métier Central** est un **lecteur pur** : il lit `dma_dossiers` et calcule les recommandations localement, sans jamais appeler `localStorage.setItem`.

---

## Modèle de données — `dma_dossiers`

Stockage : `localStorage`, clé `dma_dossiers`, tableau JSON.

### Champs canoniques v1.4 (nommage obligatoire)

```
id_dossier            · ref_devis             · nom_client
date_evenement        · type_evenement
statut_commercial     · statut_facturation    · statut_evenement
total                 · acompte_attendu       · acompte_recu
solde_attendu         · solde_recu
score_completude      · conducteur_ok         · contact_jour_j
_meta.date_creation   · _meta.derniere_modification
```

### Règles de champs immuables

- `id_dossier` : généré **une seule fois** par le Configurateur — jamais recréé ou modifié ailleurs
- `ref_devis` : même contrainte que `id_dossier`
- `total`, `acompte_attendu`, `solde_attendu` : affichés tels quels — **jamais recalculés** par un module lecteur
- `statut_commercial` : propriété exclusive du module Suivi commercial
- `statut_facturation` : valeur initiale = `non_emise` (jamais `devis_a_envoyer`)

---

## Logique de recommandation (Assistant Métier Central)

Fonction `getNextAction` — premier cas vrai = action affichée :

| Priorité | Condition | Action | Urgence |
|---|---|---|---|
| 1 | `statut_commercial = devis_a_envoyer` | Envoyer le devis | Normal |
| 2 | `statut_commercial = devis_envoye` ET J > +7j | Relancer le client | Attention |
| 3 | `statut = confirme` ET `score_completude < 80` | Compléter la préparation | Attention |
| 4 | `date_evenement ≤ J+30` ET `acompte_recu = 0` ET `statut = confirme` | Relancer l'acompte | Urgent |
| 5 | `date_evenement ≤ J+30` ET `solde_recu = 0` ET `acompte_recu > 0` | Relancer le solde | Attention |
| 6 | `date_evenement ≤ J+7` ET `conducteur_ok = false` | Valider le conducteur | Urgent |
| 7 | `date_evenement ≤ J+2` ET `score_completude < 100` | Finaliser — Jour J proche | Urgent |
| 8 | `statut_commercial = solde_recu` | Demander un avis client | Positif |
| 9 | `statut_commercial = archive` OU `perdu` | Dossier clôturé — aucune action | Neutre |

---

## Règles de gouvernance — À respecter impérativement

### Ce qu'il ne faut JAMAIS faire

1. **Modifier les fichiers `01_Règles validées/`** sans accord explicite du responsable — ces fichiers sont en lecture seule ; toute modification doit créer un nouveau fichier versionné
2. **Modifier les fichiers `02_Clôture versions/`** — ils documentent l'historique figé
3. **Régénérer ou dupliquer `id_dossier` ou `ref_devis`** — générés une seule fois par le Configurateur
4. **Recalculer `total`, `acompte_attendu` ou `solde_attendu`** dans un module lecteur
5. **Écrire dans `dma_dossiers`** depuis un module en lecture seule (Dashboard, Fiche client, Assistant)
6. **Utiliser un nom de champ non conforme** au nommage canonique v1.4
7. **Utiliser une clé localStorage autre que `dma_dossiers`**

### Ce qu'il faut faire

- **Retours terrain** → enregistrer dans `03_Retours terrain/39_retours_usage_terrain_v1.md`
- **Idées d'évolution** → enregistrer dans `04_Backlog V2/40_backlog_v2_dma_dj.md` (aucun engagement)
- **Modification de règle** → créer un nouveau fichier versionné dans `01_Règles validées/`
- **Évolution du schéma `dma_dossiers`** → documenter dans `28_regles_liaison_modules_mvp.md`
- **En cas de doute** → demander avant d'agir

---

## Comportements UI obligatoires

| Situation | Comportement attendu |
|---|---|
| `dma_dossiers` vide ou absent | Afficher données de démo + bandeau "Mode démo — aucune donnée réelle" |
| Dossier sans `date_evenement` | Masquer les alertes calendaires — ne pas planter |
| `statut_commercial` inconnu | Afficher "Statut non reconnu — vérifier le dossier" |
| 0 dossier actif | Message d'accueil + invitation à créer un premier devis |
| Erreur de lecture JSON | Fallback silencieux sur données démo + log console |

---

## Limitations connues (acceptées en v1.1)

| Limitation | Contournement |
|---|---|
| Données locales au navigateur uniquement (pas multi-appareils) | Utiliser un seul appareil dédié |
| Backup manuel uniquement | Exporter JSON hebdomadairement dans `05_exports_backups/` |
| Pas de synchronisation entre onglets | Ne jamais ouvrir 2 modules en parallèle |
| Pas d'authentification | Usage solo — accès physique requis |

---

## Roadmap

### v1.2 — Corrections mineures (non bloquantes)

- Bouton "Actualiser" depuis localStorage sans recharger la page
- Copie `id_dossier` en un clic
- Affichage `_meta.derniere_modification`
- Alerte `conducteur_ok=false` à J-10 (actuellement J-7)
- Export PDF depuis le configurateur
- Module de relance commercial automatique (logique `devis_envoye > 7j`)
- Backup JSON automatique dans chaque module
- `conducteur_ok` propagé dans préparateur + dashboard

### v2 — Évolutions structurelles

- Persistance multi-appareils (Supabase ou Google Sheets API)
- Synchronisation temps réel entre onglets (BroadcastChannel)
- Automatisations Make (email confirmation, relances)
- Module post-prestation / avis client
- Vue hebdomadaire des 5 prochains événements
- Score de risque agrégé portefeuille
- Notifications push proactives

---

## Instructions pour les assistants IA

Quand tu travailles sur ce dépôt :

1. **Lis ce fichier en premier** pour comprendre le contexte avant toute action
2. **Ne modifie pas** les fichiers dans `01_Règles validées/` et `02_Clôture versions/` sans instruction explicite
3. **Respecte le nommage canonique v1.4** pour tout champ de `dma_dossiers`
4. **Crée un nouveau fichier versionné** plutôt que de modifier un fichier de règles existant
5. **Enregistre les observations** dans `03_Retours terrain/` et les idées dans `04_Backlog V2/`
6. **Propose avant d'agir** sur tout élément impactant les règles figées
7. **La langue de travail est le français** — tous les documents et communications doivent être en français
8. **Respecte les numéros de séquence** : les nouveaux fichiers doivent continuer la numérotation (actuellement à 40)
