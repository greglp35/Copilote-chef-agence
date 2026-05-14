# Roadmap évolution qualité GitHub — Copilote Chef d’Agence

Version : V1.0  
Statut : feuille de route qualité  
Projet : Copilote Chef d’Agence

---

## 1. Objectif

Cette roadmap sert à faire évoluer le dépôt sans perdre le principe de base : simple, local, sécurisé, utile terrain.

Le but n’est pas d’ajouter de la technique pour faire de la technique. Le but est de rendre les applications HTML métier plus fiables, plus testables, plus sûres et plus faciles à reprendre par Codex, ChatGPT ou un développeur.

---

## 2. Niveau actuel

Le dépôt dispose maintenant de :

- une structure projet documentée ;
- une matrice de compétences ;
- des fiches skills ;
- une recette GitHub Actions ;
- un contrôle structure ;
- un contrôle JSON ;
- un contrôle anti-secrets ;
- un contrôle dépendances HTML ;
- des tests de non-régression pour les détecteurs.

---

## 3. Évolution A — Stabilisation immédiate

Priorité : haute.

À faire :

1. Vérifier que le workflow `Recette projet` passe sur `main`.
2. Ne jamais merger les PR de test contenant des erreurs volontaires.
3. Fermer ou conserver clairement les PR de test comme exemples pédagogiques.
4. Lire les logs GitHub Actions après chaque changement important.
5. Documenter les faux positifs éventuels.

Critère de réussite :

```text
Main reste propre, la recette passe, les tests de détecteurs fonctionnent.
```

---

## 4. Évolution B — Améliorer la qualité HTML

Priorité : haute.

Ajouter progressivement :

- vérification présence `<title>` ;
- vérification présence `<meta name="description">` ;
- vérification présence d’un seul `<h1>` ;
- vérification absence de CDN ;
- vérification boutons avec texte lisible ;
- vérification attributs `alt` sur les images ;
- vérification présence d’un rappel validation humaine dans les modules critiques.

Critère de réussite :

```text
Chaque HTML métier est lisible, autonome, accessible au minimum et cohérent avec le terrain.
```

---

## 5. Évolution C — Contrôles métier stock / TFI

Priorité : haute pour les modules stock.

Ajouter un script de contrôle métier capable de repérer :

- mini supérieur au maxi ;
- multiple achat absent ou inférieur à 1 ;
- stock minimum chiffré sans consommation ;
- quantité de réapprovisionnement non multiple du conditionnement ;
- export TFI sans validation humaine ;
- export TFI sans validateur ;
- export TFI sans justification.

Critère de réussite :

```text
Une erreur métier évidente ne peut plus passer silencieusement.
```

---

## 6. Évolution D — Rapports automatiques

Priorité : moyenne.

Créer un rapport généré automatiquement :

```text
/rapports/recette/rapport-recette.md
```

Contenu recommandé :

- date du contrôle ;
- fichiers contrôlés ;
- erreurs bloquantes ;
- avertissements ;
- verdict ;
- actions recommandées.

Critère de réussite :

```text
Chaque recette laisse une trace lisible humainement.
```

---

## 7. Évolution E — Standard de fiche projet obligatoire

Priorité : moyenne.

Créer un contrôle qui vérifie que chaque fichier HTML dans `/src` possède une fiche projet associée dans `/projets`.

Exemple :

```text
src/stock-mini-maxi.html
projets/stock-mini-maxi.md
```

Critère de réussite :

```text
Aucune application HTML ne reste sans cadrage métier.
```

---

## 8. Évolution F — Niveau avancé plus tard

À reporter :

- backend ;
- authentification ;
- API ;
- connexion Graph ;
- connexion directe ERP ;
- automatisation avancée ;
- écriture TFI ;
- base de données serveur.

Ces sujets ne doivent venir qu’après stabilisation des formats, des contrôles, des règles de sécurité et de la recette humaine.

---

## 9. Règle de décision

Avant d’ajouter une amélioration, poser trois questions :

1. Est-ce que cela réduit un risque réel ?
2. Est-ce que cela améliore l’usage terrain ?
3. Est-ce que cela reste compréhensible et maintenable ?

Si la réponse est non à deux questions sur trois, reporter.

---

## 10. Verdict

La meilleure évolution n’est pas de rendre le dépôt plus complexe.

La meilleure évolution est de rendre chaque application :

- plus sûre ;
- plus contrôlable ;
- plus lisible ;
- plus proche du terrain ;
- plus facile à reprendre par IA ou développeur.
