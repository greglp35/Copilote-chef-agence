# DMA DJ — Copilote Chef d'Agence

Application React locale pour le pilotage d'une agence DJ.
Version : **MVP v1.1** — stabilisée le 23 mars 2026.

---

## Installation et lancement

### Prérequis

- Node.js >= 18
- npm >= 9

### Commandes

```bash
# 1. Installer les dépendances (une seule fois)
cd app
npm install

# 2. Lancer en local
npm run dev
# → http://localhost:5173

# 3. Build de production (optionnel)
npm run build
npm run preview
```

---

## Structure du projet

```
src/
├── main.jsx                     Point d'entrée
├── App.jsx                      Shell + navigation centrale
├── styles/
│   └── global.css               Feuille de style unique
├── components/
│   ├── Layout.jsx               Sidebar + bandeau démo
│   ├── BackupButton.jsx         Bouton export JSON
│   └── DossierSelect.jsx        Sélecteur dossier partagé
├── lib/
│   ├── storage.js               Lecture/écriture localStorage
│   ├── backup.js                Export JSON téléchargeable
│   ├── demo-data.js             Jeu de démonstration statique
│   ├── dates.js                 Utilitaires de dates
│   ├── format.js                Formatage (montant, date)
│   └── rules.js                 getNextAction — logique 37 §3
├── data/
│   └── referentiel.js           Statuts canoniques v1.4
├── hooks/
│   └── useDossiers.js           État React + délégation storage
└── modules/
    ├── assistant-central/       Hub de recommandation (lecture pure)
    ├── configurateur/           Créer un dossier — source des montants
    ├── suivi/                   Statuts commerciaux + paiements
    ├── preparateur/             Score, conducteur_ok, contact
    ├── dashboard/               KPIs agrégés (lecture seule)
    ├── fiche-client/            Vue synthétique (lecture seule)
    ├── checklist/               Points de contrôle Jour J
    └── conducteur/              Déroulé interactif soirée
```

---

## Persistance des données

Toutes les données sont stockées localement dans le navigateur.

| Clé localStorage | Contenu |
|---|---|
| `dma_dossiers` | Tableau de tous les dossiers (source principale) |
| `dma_checklist_<id>` | État de la checklist par dossier |
| `dma_conducteur_<id>` | Étapes du conducteur par dossier |

### Règles importantes

- Ne jamais ouvrir deux onglets en même temps — risque de conflit
- Utiliser un seul appareil (pas de synchronisation multi-appareils en v1)
- La clé `dma_dossiers` est **figée** — ne pas la renommer

---

## Mode démo

Si `dma_dossiers` est absent ou vide, l'application affiche automatiquement un **bandeau jaune** et charge 4 dossiers de démonstration couvrant les cas principaux :

- Mariage confirmé, acompte non reçu → **URGENT**
- Anniversaire avec devis envoyé > 7j → **Relancer le client**
- Soirée privée soldée → **Demander un avis**
- Séminaire devis à envoyer → **Envoyer le devis**

Le mode démo s'efface dès que vous créez un vrai dossier dans le **Configurateur**.

---

## Backup JSON

Chaque module dispose d'un bouton **Backup JSON** qui télécharge un fichier :

```
dma_dossiers_backup_YYYY-MM-DD.json
```

### Restaurer depuis un backup

```js
// Dans la console du navigateur (F12 → Console)
const data = /* coller le contenu du fichier backup ici */
localStorage.setItem('dma_dossiers', JSON.stringify(data.dossiers))
location.reload()
```

---

## Modules — rôles et droits

| Module | Lecture | Ecriture | Champs écrits |
|---|---|---|---|
| Assistant central | ✅ | ✗ | — |
| Configurateur | ✅ | ✅ | `id_dossier`, `ref_devis`, `total`, `acompte_attendu`, `solde_attendu` |
| Suivi commercial | ✅ | ✅ | `statut_commercial`, `statut_facturation`, `acompte_recu`, `solde_recu` |
| Préparateur | ✅ | ✅ | `score_completude`, `conducteur_ok`, `contact_jour_j`, `statut_evenement` |
| Dashboard KPI | ✅ | ✗ | — |
| Fiche client | ✅ | ✗ | — |
| Checklist Jour J | ✅ | ✅ | `dma_checklist_<id>` (séparé) |
| Conducteur | ✅ | ✅ | `dma_conducteur_<id>` (séparé) |

---

## Champs canoniques v1.4

```
id_dossier · ref_devis · nom_client · date_evenement · type_evenement
statut_commercial · statut_facturation · statut_evenement
total · acompte_attendu · acompte_recu · solde_attendu · solde_recu
score_completude · conducteur_ok · contact_jour_j
_meta.date_creation · _meta.derniere_modification
```
