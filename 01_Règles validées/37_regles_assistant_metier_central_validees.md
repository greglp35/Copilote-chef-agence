# 37 — Règles de l'Assistant Métier Central — DMA DJ

## Statut officiel

✅ VALIDÉ — VERSION DE RÉFÉRENCE
Date de validation : 23 mars 2026
Basé sur : 28_regles_liaison_modules_mvp.md · 33_validation_mvp_coeur_dma_dj.md · 36_audit_global_systeme_dma_dj.md

---

## 1. Rôle exact du module dans le système global

L'Assistant Métier Central est le hub de navigation et de recommandation du système DMA DJ.

Son rôle est double :
1. **Orienter** : afficher la prochaine action recommandée pour chaque dossier actif
2. **Naviguer** : servir de point d'entrée unique vers les 7 modules du système

Ce module est un **lecteur pur et un orienteur**. Il ne modifie jamais `dma_dossiers`.

### Position dans le pipeline

```
TOUS LES MODULES (producteurs d'état)
        ↓ écrivent dans dma_dossiers
ASSISTANT MÉTIER CENTRAL (lecteur + orienteur)
        ↑ lit dma_dossiers
        ↑ calcule la prochaine action selon les statuts
        ↑ affiche un récapitulatif d'activité
        ↑ navigue vers les modules
```

---

## 2. Règles fondamentales absolues

| Règle | Formulation |
|---|---|
| R1 | `id_dossier` n'est jamais généré, dupliqué ou modifié par ce module |
| R2 | `ref_devis` n'est jamais généré, dupliqué ou modifié par ce module |
| R3 | `total`, `acompte_attendu`, `solde_attendu` sont affichés tels quels — jamais recalculés |
| R4 | `dma_dossiers` est lu en lecture seule stricte — aucun `localStorage.setItem` autorisé |
| R5 | Le nommage canonique v1.4 (`28_regles_liaison_modules_mvp.md`) est obligatoire |
| R6 | Ce module ne remplace aucun autre module — il oriente vers eux |
| R7 | Fallback sur jeu de démonstration statique si `dma_dossiers` est vide ou absent |
| R8 | Les recommandations sont calculées localement — jamais stockées dans `dma_dossiers` |

---

## 3. Logique de recommandation `getNextAction`

La recommandation est déterminée dans l'ordre de priorité suivant (premier cas vrai = action affichée) :

| Priorité | Condition | Recommandation affichée | Niveau d'urgence |
|---|---|---|---|
| 1 | `statut_commercial = devis_a_envoyer` | Envoyer le devis | 🔵 Normal |
| 2 | `statut_commercial = devis_envoye` ET J > +7j depuis émission | Relancer le client | 🟡 Attention |
| 3 | `statut_commercial = confirme` ET `score_completude < 80` | Compléter la préparation | 🟡 Attention |
| 4 | `date_evenement ≤ J+30` ET `acompte_recu = 0` ET `statut = confirme` | Relancer l'acompte | 🔴 Urgent |
| 5 | `date_evenement ≤ J+30` ET `solde_recu = 0` ET `acompte_recu > 0` | Relancer le solde | 🟡 Attention |
| 6 | `date_evenement ≤ J+7` ET `conducteur_ok = false` | Valider le conducteur de soirée | 🔴 Urgent |
| 7 | `date_evenement ≤ J+2` ET `score_completude < 100` | Finaliser la préparation — Jour J proche | 🔴 Urgent |
| 8 | `statut_commercial = solde_recu` | Prestation soldée — demander un avis client | 🟢 Positif |
| 9 | `statut_commercial = archive` OU `perdu` | Dossier clôturé — aucune action requise | ⬜ Neutre |
| — | Aucun cas correspondant | Dossier en cours — vérifier l'état | ⬜ Neutre |

---

## 4. Indicateurs du récapitulatif d'activité

L'assistant affiche ces compteurs globaux en lecture de `dma_dossiers` :

| Indicateur | Calcul | Usage |
|---|---|---|
| Dossiers actifs | `statut_commercial ∉ {archive, perdu}` | Charge de travail |
| Événements à venir ≤ 30j | `date_evenement` entre aujourd'hui et J+30 | Alertes terrain |
| Acomptes en attente | `acompte_attendu > 0` ET `acompte_recu = 0` ET `statut ≠ perdu` | Trésorerie |
| Soldes en attente | `solde_attendu > 0` ET `solde_recu = 0` ET `statut = acompte_recu` | Trésorerie |
| Dossiers URGENT | Conditions priorités 4, 6 ou 7 vraies | Focus immédiat |
| CA confirmé YTD | Somme `total` pour `statut ∈ {confirme, acompte_recu, solde_recu, archive}` | Pilotage |

---

## 5. Hub de navigation — modules accessibles

| Module | Identifiant lien | Usage attendu |
|---|---|---|
| Configurateur de devis | `configurateur` | Créer / consulter un devis |
| Suivi commercial & paiements | `suivi` | Gérer les statuts et encaissements |
| Préparateur de prestation | `preparateur` | Préparer une prestation |
| Dashboard KPI | `dashboard` | Vue globale activité |
| Fiche client intelligente | `fiche_client` | Vue synthétique d'un dossier |
| Checklist Jour J | `checklist` | Validation terrain le jour J |
| Conducteur de soirée | `conducteur` | Déroulé en temps réel |

---

## 6. Comportements UI obligatoires

| Situation | Comportement attendu |
|---|---|
| `dma_dossiers` vide ou absent | Afficher données de démonstration + bandeau "Mode démo — aucune donnée réelle" |
| Dossier sans `date_evenement` | Masquer les alertes calendaires — ne pas planter |
| Dossier avec `statut_commercial` inconnu | Afficher "Statut non reconnu — vérifier le dossier" |
| 0 dossier actif | Afficher message d'accueil + invitation à créer un premier devis |
| Erreur de lecture JSON | Fallback silencieux sur données démo + log console |

---

## 7. Champs canoniques utilisés (lecture)

Nommage strict issu de `28_regles_liaison_modules_mvp.md` v1.4 :

```
id_dossier · ref_devis · nom_client · date_evenement · type_evenement
statut_commercial · statut_facturation · statut_evenement
total · acompte_attendu · acompte_recu · solde_attendu · solde_recu
score_completude · conducteur_ok · contact_jour_j
_meta.date_creation · _meta.derniere_modification
```

---

## 8. Contraintes absolues rappelées

1. `id_dossier` n'est jamais généré, dupliqué ou modifié par cet assistant
2. `ref_devis` n'est jamais généré, dupliqué ou modifié par cet assistant
3. `total`, `acompte_attendu`, `solde_attendu` ne sont jamais recalculés
4. `dma_dossiers` est lu en lecture seule stricte — aucun `localStorage.setItem` autorisé
5. Le nommage canonique v1.4 est obligatoire — aucun alias non conforme toléré
6. Ce module ne remplace aucun autre module — il oriente vers eux

---

## 9. Évolutions prévues

### v1.2 — Corrections mineures non bloquantes

| Evolution | Effort estimé |
|---|---|
| Bouton "Actualiser" depuis localStorage sans recharger la page | 10 min |
| Copie `id_dossier` en un clic pour ouverture dans un module cible | 10 min |
| Affichage `_meta.derniere_modification` — signal de fraîcheur du dossier | 15 min |
| Alerte `conducteur_ok=false` à J-10 (actuellement J-7) | < 5 min |

### v2 — Évolutions structurelles

| Evolution | Prérequis |
|---|---|
| Vue hebdomadaire des 5 prochains événements | Aucun |
| Alerte si `score_completude` non remonté après J-30 + confirmés | `score_completude` écrit dans `dma_dossiers` par le préparateur |
| Score de risque agrégé portefeuille | Logique à définir |

### v3 — Conditionnelles à migration Glide/Sheets/Make

| Evolution | Description |
|---|---|
| Synchronisation temps réel | Remplacer localStorage par Supabase ou Google Sheets API |
| Notifications push proactives | Alerte si dossier passe en URGENT |
| Recommandations cross-dossiers | "3 dossiers nécessitent une action aujourd'hui" |

---

## 10. Compatibilité système

| Module | Relation | Statut |
|---|---|---|
| `06_referentiel_metier.json` | Source de vérité des statuts et formules | ✅ Aligné |
| `28_regles_liaison_modules_mvp.md` | Nommage canonique — obligatoire | ✅ Respecté |
| `33_validation_mvp_coeur_dma_dj.md` | Validation chaîne — structure `dma_dossiers` figée | ✅ Conforme |
| `24_regles_configurateur_devis_validees.md` | Producteur de `id_dossier` et montants | ✅ Lecture seule |
| `35_regles_fiche_client_intelligente_validees.md` | Lecteur transversal — rôles complémentaires | ✅ Pas de collision |
| `27_regles_dashboard_kpi_validees.md` | Lecteur agrégateur — rôles complémentaires | ✅ Pas de collision |

---

| Version | Date | Changement | Statut |
|---|---|---|---|
| 1.0 | 23 mars 2026 | Création post-audit global | ✅ Validé |
