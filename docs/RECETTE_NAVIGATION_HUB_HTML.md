# Recette navigation hub — HTML métier

Version : V1.0  
Projet : Copilote Chef d'Agence  
Hub principal : `src/index.html`

---

## 1. Objectif de la recette

Vérifier que tous les modules HTML métier sont accessibles depuis le hub central et que l'utilisateur peut revenir facilement au hub sans se perdre.

---

## 2. Règle de validation

Un module HTML est considéré conforme si :

1. il est visible dans `src/index.html` ;
2. il est déclaré dans `data/html-hub-index.json` ;
3. il contient un lien visible `Retour au hub` ;
4. le lien pointe vers `index.html` depuis un fichier placé dans `src/` ;
5. le lien fonctionne sur mobile ;
6. le lien n'apparaît pas à l'impression ;
7. le module reste autonome ;
8. aucune dépendance externe n'est ajoutée ;
9. aucun secret n'est ajouté ;
10. la validation humaine reste mentionnée quand le module déclenche une décision métier.

---

## 3. Tableau de recette

| Module | Déclaré hub HTML | Déclaré index JSON | Retour hub visible | Mobile OK | Impression OK | Statut |
|---|---:|---:|---:|---:|---:|---|
| `src/index.html` | oui | oui | non applicable | à tester | à tester | créé |
| `src/stock-mini-maxi.html` | oui | oui | à patcher prudemment | à tester | à tester | gros fichier historique |
| `src/stock-mini-maxi-tfi.html` | oui | oui | à patcher | à tester | à tester | à faire |
| `src/pilotage-stock-chantier.html` | oui | oui | à patcher | à tester | à tester | à faire |
| `src/couverture-chantier.html` | oui | oui | à patcher | à tester | à tester | à faire |
| `src/plan-parc-magasinier.html` | oui | oui | à patcher | à tester | à tester | à faire |
| `src/preparation-commandes-client.html` | oui | oui | à patcher | à tester | à tester | à faire |
| `src/recette-test.html` | oui | oui | à patcher | à tester | à tester | à faire |

---

## 4. Test manuel rapide

Pour chaque fichier HTML :

1. Ouvrir le fichier localement.
2. Vérifier la présence du bouton `← Retour au hub` en haut de page.
3. Cliquer sur le bouton.
4. Vérifier le retour vers `src/index.html`.
5. Revenir au module depuis le hub.
6. Tester sur largeur mobile.
7. Lancer l'impression et vérifier que le bouton n'apparaît pas.
8. Contrôler la console navigateur si possible.

---

## 5. Snippet obligatoire

### HTML

```html
<a class="hub-return" href="index.html" aria-label="Retour au hub central HTML métier">← Retour au hub</a>
```

### CSS

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

## 6. Méthode de patch recommandée

Pour éviter de casser les gros fichiers HTML :

1. Modifier un fichier à la fois.
2. Ajouter uniquement CSS + lien HTML.
3. Ne pas reformater tout le fichier.
4. Ne pas toucher à la logique JavaScript.
5. Tester immédiatement le module.
6. Commiter avec un message clair.
7. Mettre à jour `data/html-hub-index.json` si le statut change.

---

## 7. Critère de fin

La navigation sera considérée terminée quand :

- tous les modules HTML déclarés ont un bouton `Retour au hub` ;
- le tableau de recette est passé à `OK` ;
- l'issue GitHub est mise à jour ;
- aucune régression visuelle ou fonctionnelle n'est constatée.

---

## 8. Verdict senior

Ne pas confondre vitesse et solidité. Ajouter un lien de navigation semble simple, mais une réécriture imprudente d'un gros HTML peut casser une application métier. La bonne méthode est un patch léger, traçable, testé et réversible.