# Recette manuelle — Stock mini/maxi

## Objectif

Cette recette vérifie que le module `stock-mini-maxi` est utilisable sur le terrain avant diffusion.

Elle complète les contrôles automatiques GitHub Actions.

## 1. Préparation

- [ ] Ouvrir `src/stock-mini-maxi.html` sur ordinateur.
- [ ] Ouvrir le même fichier sur mobile.
- [ ] Vérifier que l'écran est lisible sans zoom forcé.
- [ ] Vérifier que les boutons sont utilisables au doigt.

## 2. Chargement des données

- [ ] Cliquer sur **Charger exemple**.
- [ ] Vérifier que le tableau se remplit.
- [ ] Vérifier que les KPI apparaissent.
- [ ] Importer `data/stock-mini-maxi.example.json`.
- [ ] Vérifier que l'import fonctionne.

## 3. Lecture des statuts

- [ ] Filtrer sur **Sous mini**.
- [ ] Vérifier qu'au moins un article apparaît.
- [ ] Filtrer sur **À commander**.
- [ ] Vérifier que la quantité recommandée est lisible.
- [ ] Filtrer sur **Surstock**.
- [ ] Vérifier que les articles affichés dépassent le maxi.
- [ ] Filtrer sur **OK**.
- [ ] Vérifier que les articles affichés sont cohérents.

## 4. Vérification métier sur exemples

Pour chaque article prioritaire :

- [ ] contrôler le stock physique ;
- [ ] contrôler le stock réservé ;
- [ ] contrôler les commandes en cours ;
- [ ] contrôler le mini ;
- [ ] contrôler le maxi ;
- [ ] contrôler le multiple d'achat ;
- [ ] vérifier que la quantité recommandée n'est pas appliquée automatiquement.

## 5. Recherche et tri

- [ ] Rechercher un article par code.
- [ ] Rechercher un article par famille.
- [ ] Rechercher un article par emplacement.
- [ ] Trier par priorité.
- [ ] Trier par quantité recommandée.
- [ ] Trier par famille.

## 6. Sauvegarde locale

- [ ] Cliquer sur **Sauvegarder**.
- [ ] Rafraîchir la page.
- [ ] Vérifier que les données sont restaurées.

## 7. Export

- [ ] Cliquer sur **Exporter analyse**.
- [ ] Vérifier qu'un fichier JSON est généré.
- [ ] Ouvrir le fichier exporté.
- [ ] Vérifier que le message de validation humaine est présent.

## 8. Impression

- [ ] Cliquer sur **Imprimer**.
- [ ] Vérifier que les boutons ne sont pas imprimés.
- [ ] Vérifier que le tableau reste lisible.
- [ ] Vérifier que la synthèse est exploitable en réunion ou brief.

## 9. Sécurité

- [ ] Vérifier qu'aucune donnée réelle sensible n'est utilisée.
- [ ] Vérifier qu'aucun identifiant n'est présent.
- [ ] Vérifier qu'aucune connexion à un système externe n'est présente.
- [ ] Vérifier que les données importées sont fictives ou anonymisées.

## 10. Verdict humain

Décision : valide | à corriger | bloqué  
Validateur : [nom]  
Date : [AAAA-MM-JJ]  
Commentaire : [commentaire]

## Critère de validation

Le module est validable si :

- les contrôles automatiques sont verts ;
- la recette mobile est correcte ;
- l'import/export fonctionne ;
- les statuts sont compréhensibles ;
- aucune donnée sensible n'est utilisée ;
- l'utilisateur comprend que la décision reste humaine.
