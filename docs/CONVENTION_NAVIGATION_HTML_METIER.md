# Convention de navigation — HTML métier

Version : V1.0  
Projet : Copilote Chef d'Agence  
Fichier hub principal : `src/index.html`

---

## 1. Objectif

Tous les modules HTML métier doivent être accessibles depuis un hub central et permettre un retour simple vers ce hub.

Le hub central oriente. Les modules spécialisés exécutent.

---

## 2. Règle d'architecture

Chaque nouveau module HTML doit respecter les règles suivantes :

1. Être autonome.
2. Fonctionner en local.
3. Ne pas dépendre d'un CDN.
4. Ne pas dépendre d'un framework externe.
5. Ne pas contenir de mot de passe, token, identifiant AS400, chaîne ODBC ou SQL sensible.
6. Être utilisable sur mobile.
7. Être référencé dans `src/index.html`.
8. Être référencé dans `data/html-hub-index.json`.
9. Avoir une fiche projet JSON dans `projets/` si le module devient durable.
10. Avoir un lien visible `Retour au hub`.

---

## 3. Standard du bouton Retour au hub

Le bouton doit être visible rapidement, idéalement dans le header.

### HTML recommandé

```html
<a class="hub-return" href="index.html" aria-label="Retour au hub central HTML métier">← Retour au hub</a>
```

### CSS recommandé

```css
.hub-return{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:40px;
  padding:.65rem .9rem;
  border-radius:999px;
  background:#f5c400;
  color:#1a1a1a;
  font-weight:900;
  text-decoration:none;
  width:max-content;
  max-width:100%;
  margin-bottom:.65rem;
}
.hub-return:focus-visible{
  outline:3px solid #f5c400;
  outline-offset:3px;
}
@media print{
  .hub-return{display:none}
}
```

---

## 4. Emplacement recommandé

Dans le header, avant le badge ou le titre :

```html
<header>
  <div class="wrap">
    <a class="hub-return" href="index.html">← Retour au hub</a>
    ...
  </div>
</header>
```

Si le fichier HTML est dans `src/`, le lien est :

```html
href="index.html"
```

Si le fichier est dans un sous-dossier, adapter le chemin :

```html
href="../index.html"
```

---

## 5. Règle de maintenance de l'index JSON

Tout nouveau module doit être ajouté dans :

`data/html-hub-index.json`

Champs minimum :

```json
{
  "id": "nom-module",
  "title": "Titre lisible",
  "category": "stock|chantier|terrain|preparation|referentiel|recette",
  "path": "src/nom-module.html",
  "status": "draft|operational|reference|test",
  "purpose": "Objectif opérationnel du module",
  "keywords": ["mot", "clé"]
}
```

---

## 6. Règle de recette

Avant validation d'un module HTML, contrôler :

| Point | Obligatoire |
|---|---:|
| Présent dans `src/index.html` | oui |
| Présent dans `data/html-hub-index.json` | oui |
| Lien `Retour au hub` visible | oui |
| Mobile lisible | oui |
| Zéro CDN | oui |
| Zéro secret | oui |
| Validation humaine mentionnée si décision métier | oui |
| Impression propre si utile | recommandé |

---

## 7. Modules existants à harmoniser

Modules à patcher progressivement avec le bouton `Retour au hub` :

- `src/stock-mini-maxi.html`
- `src/stock-mini-maxi-tfi.html`
- `src/pilotage-stock-chantier.html`
- `src/couverture-chantier.html`
- `src/plan-parc-magasinier.html`
- `src/preparation-commandes-client.html`
- `src/recette-test.html`

Priorité :

1. Modules courts ou récemment créés.
2. Modules déjà stabilisés.
3. Gros modules historiques après recette ou patch contrôlé.

---

## 8. Décision senior

Ne pas réécrire un gros HTML uniquement pour ajouter un bouton de navigation. La modification doit être légère, localisée, testable et réversible.

La bonne pratique est :

> petite modification visible + index JSON à jour + traçabilité dans l'issue GitHub.
