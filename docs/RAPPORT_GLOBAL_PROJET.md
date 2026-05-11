# Rapport global projet — Guide d'exploitation

## Objectif

Le workflow **Rapport Global Projet** sert à consolider l'état du dépôt **Copilote Chef d'Agence** dans un rapport unique.

Il ne remplace pas les workflows spécialisés. Il les complète.

## Ce que le rapport vérifie

Le rapport global contrôle :

- la structure du dépôt ;
- la présence des documents de référence ;
- la présence des workflows socles ;
- les fichiers HTML dans `/src` ;
- les règles de sécurité de premier niveau ;
- les dépendances externes ;
- la qualité du `.gitignore` ;
- les dernières exécutions GitHub Actions quand l'information est disponible ;
- les prochaines actions prioritaires.

## Artifacts générés

Le workflow publie deux fichiers :

```text
rapports/rapport-global-projet.md
rapports/rapport-global-projet.json
```

Le fichier Markdown est fait pour être lu par un humain.

Le fichier JSON est fait pour être réutilisé plus tard dans un cockpit, une automatisation ou un tableau de bord.

## Lecture du verdict

### Vert

Le dépôt est propre et exploitable comme base projet.

### Orange

Le dépôt est utilisable mais certaines corrections sont nécessaires avant industrialisation.

### Rouge

Le dépôt contient un problème bloquant, souvent lié à la sécurité ou à une structure incomplète.

## Règle de décision

Même si le rapport est vert, la validation humaine reste obligatoire avant :

- diffusion d'une application ;
- utilisation avec des données réelles ;
- connexion à un export métier ;
- intégration dans un cockpit ;
- partage avec une équipe.

## Usage recommandé

Lancer le rapport global après :

1. ajout d'une application HTML ;
2. modification d'un workflow ;
3. ajout d'un schéma JSON ;
4. correction de sécurité ;
5. préparation d'une version stable.

## Limites connues

Le rapport global est un contrôle statique.

Il ne peut pas garantir à lui seul :

- l'absence totale de bugs ;
- la qualité UX réelle sur le terrain ;
- la conformité juridique complète ;
- la sécurité d'une infrastructure externe ;
- la qualité métier d'une règle de décision.

Il sert à réduire les risques évidents et à donner une vision consolidée du projet.
