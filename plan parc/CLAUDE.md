# CLAUDE.md — UltraPlan · Négoce Matériaux

## Nature du projet

UltraPlan est un outil de planification de parc de stockage pour agences de négoce de matériaux de construction. Il se présente sous la forme d'un fichier HTML unique, 100 % offline, sans aucune dépendance externe.

Le fichier courant est **UltraPlan v2** (~133 KB, ~2 576 lignes).

---

## Contraintes techniques absolues

Ces règles sont non négociables et s'appliquent à toute modification :

- 1 seul fichier `.html` — jamais de split CSS/JS/assets
- HTML + CSS + JavaScript vanilla uniquement — aucun framework, aucun CDN
- `localStorage` interdit
- `fetch()` interdit
- Coordonnées stockées en millimètres dans le STATE — jamais en pixels
- SVG natif pour la visualisation 2D — pas de canvas
- `requestAnimationFrame` pour les animations et le drag
- Séparation stricte dans le code : `STATE | LOGIC | SVG | UI | EXPORT`

---

## Architecture du STATE

```javascript
S = {
  park:    { name, w, d },           // dimensions en mm
  zones:   [{ id, name, type, x, y, w, d, color }],
  aisles:  [{ id, name, zoneId, orient, w, x, y, length, type, dir }],
  structs: [{ id, name, type, zoneId, aisleId, orient, rotDeg, x, y, ... }],
  prods:   [{ id, ref, name, fam, l, w, h, kg, pal, pL, pW, tH, ... }],
  pla:     {},   // slotKey → produitId
  sel:     null, // id structure sélectionnée
  _id:     1     // compteur auto-incrémenté — toujours via nid()
}
```

Règle `_id` : utiliser exclusivement `nid()`. Lors du chargement JSON, recalculer via `Math.max(...allIds) + 1`.

---

## Fonctions clés

| Fonction | Rôle |
|---|---|
| `fp(s)` | Footprint (w, h) en mm — tient compte de `rotDeg` |
| `effectiveOrient(s)` | Orientation réelle après rotation (H ou V) |
| `compat(slotKey, prodId)` | Moteur compatibilité → `{st, pc, msg}` |
| `computeAlerts()` | Alertes métier actives (chevauchement, hors zone, surcharge…) |
| `computeScores()` | 4 scores qualité : circulation, logistique, sécurité, occupation |
| `slotAddr(sId,f,a,b)` | Adresse terrain canonique `INT-A01-R03-F1-T02-N01` |
| `pushHistory()` | Snapshot avant mutation — obligatoire avant tout changement STATE |
| `renderAll()` | Rendu complet — appeler après toute mutation STATE |
| `setupSvgWrap(id)` | Attache tous les listeners SVG (wheel, down, move, up, over) |

---

## Règles de rotation

`rotDeg` : 0, 90, 180, 270. Cycler via `rotateStruct(id)`.

`fp(s)` calcule le footprint : `0°/180°` → dimensions de base, `90°/270°` → dimensions transposées.

`effectiveOrient(s)` : `H XOR (rotDeg%180 !== 0)`. Utiliser pour les séparateurs SVG internes, jamais `s.orient` seul.

---

## Format d'adressage terrain

```
Rack      : {ZONE}-{ALLÉE}-{STRUCT}-F{face}-T{travée 2 chiffres}-N{niveau 2 chiffres}
Cantilever: {ZONE}-{ALLÉE}-{STRUCT}-F{face}-C{colonne 2 chiffres}-B{bras 2 chiffres}
```

Codes zones : `INT` (intérieur), `COV` (couvert), `EXT` (extérieur), `DGX` (dangereux), `PCK` (picking rapide).

---

## Raccourcis clavier (un seul listener)

`R` rotation · `D` dupliquer · `Suppr` supprimer · `Esc` désélectionner · `+/-` zoom · `F` ajuster · `Ctrl+Z/Y` undo/redo · `Ctrl+S` JSON · `?` aide

**Règle** : un seul `document.addEventListener('keydown')` dans le code. Ne jamais en ajouter un second.

---

## Import CSV catalogue

Format attendu (séparateur `;` ou `,`, ligne 1 = entête ignorée) :
```
ref;nom;famille;L;l;H;poids;conditionnement;palette;palL;palW;htotale;rack;cant;sol;rotation;exterieur;note
```
Les champs booléens acceptent : `o`, `oui`, `1`, `true`, `yes` (insensible à la casse).

---

## Backlog V2 restant

| Fonctionnalité | Complexité | Valeur terrain |
|---|---|---|
| Rotation libre avec collision SAT | Haute | Moyenne — parcs rectilignes majoritaires |
| Déplacement Mode C (allée + contenu + recalcul adresses) | Haute | Haute — réorg complète d'allée |
| Multi-sélection + déplacement groupé | Moyenne | Haute — gain de temps |
| Saisonnalité (2 configurations) | Moyenne | Moyenne |

---

## Checklist avant livraison

- [ ] Coordonnées STATE en mm
- [ ] `pushHistory()` avant toute mutation
- [ ] `effectiveOrient()` utilisé dans le rendu SVG interne
- [ ] Un seul listener `keydown`
- [ ] `_id` recalculé proprement au chargement JSON
- [ ] `localStorage` absent
- [ ] `fetch()` absent
- [ ] `renderAll()` appelé après chaque mutation
- [ ] Démo réaliste fonctionnelle
- [ ] Exports CSV + Excel testés
