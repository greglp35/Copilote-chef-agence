# DMA DJ — Lancement local

## Prérequis

- Node.js >= 18 installé
- npm >= 9 installé

Vérification : `node -v` et `npm -v`

## Lancement

```bash
cd app
npm install
npm run dev
```

Puis ouvrir : http://localhost:5173

## Modules disponibles

| Module | Rôle |
|---|---|
| Assistant | Hub de recommandation — lecture seule |
| Configurateur | Créer un dossier — seul générateur de id_dossier |
| Suivi commercial | Gérer statuts et paiements |
| Préparateur | score_completude, conducteur_ok, contact |
| Dashboard KPI | Vue globale agrégée |
| Fiche client | Vue synthétique d'un dossier |
| Checklist Jour J | Points de contrôle terrain |
| Conducteur | Déroulé en temps réel |

## Données

Les données sont stockées dans `localStorage['dma_dossiers']` du navigateur.

- Mode démo actif si la clé est absente ou vide (bandeau jaune)
- Créer un premier dossier dans le Configurateur pour démarrer en mode réel
- Utiliser le bouton **Backup JSON** (présent dans chaque module) pour exporter les données

## Backup et restauration

**Exporter :** Backup JSON → télécharge `dma_dossiers_backup_YYYY-MM-DD.json`

**Restaurer depuis un fichier JSON :**
```js
// Dans la console du navigateur (F12)
const data = /* coller le contenu JSON ici */
localStorage.setItem('dma_dossiers', JSON.stringify(data))
location.reload()
```

## Build production (optionnel)

```bash
npm run build
npm run preview
```

## Notes importantes

- Ne jamais ouvrir deux onglets en même temps — risque de conflit
- Utiliser un seul appareil dédié (pas de synchronisation multi-appareils en V1)
- Exporter le backup JSON hebdomadairement pour éviter toute perte
- Version : MVP v1.1 — Stabilisée le 23 mars 2026
