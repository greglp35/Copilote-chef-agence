# Plan Parc Magasinier — Interface terrain TFI

## Objectif

Créer une interface simple pour les magasiniers afin de visualiser le parc, retrouver les zones TFI, consulter les consignes terrain et déclarer les anomalies sans modifier directement l'ERP.

## Problème terrain

Le stockage, la préparation et la circulation dans le parc nécessitent une lecture claire des zones. Une simple liste d'articles ne suffit pas toujours pour guider un magasinier, surtout lorsqu'il faut localiser rapidement un produit, vérifier une zone ou remonter un problème.

## Utilisateurs cibles

- magasinier ;
- responsable exploitation ;
- chef d'agence ;
- vendeur comptoir.

## Fichier principal

```text
src/plan-parc-magasinier.html
```

## Fonctions incluses

- plan SVG interactif ;
- zones TFI cliquables ;
- recherche par article, famille ou zone ;
- filtres par type de zone ;
- fiche zone avec consignes ;
- liste des articles rattachés ;
- déclaration locale d'anomalies ;
- export CSV des anomalies ;
- export JSON du plan ;
- impression.

## Règle TFI

```text
code_zone_tfi = 6 caractères alphanumériques
sans tiret
sans espace
en majuscules
```

Exemples :

```text
CR0101
DP0201
LS0101
```

Les tirets sont seulement un affichage humain.

## Sécurité et limites

- aucun mot de passe dans le HTML ;
- aucun token dans le HTML ;
- aucun identifiant AS400 ;
- aucune chaîne ODBC ;
- aucune requête SQL sensible ;
- données de démonstration uniquement ;
- validation humaine obligatoire avant diffusion terrain.

## Hors périmètre

- modification automatique de TFI ;
- remplacement du plan officiel de sécurité ;
- stockage de données nominatives client ;
- connexion directe à l'ERP.

## Critères de validation

- lisible sur mobile ;
- compréhensible en moins de 10 secondes ;
- zones cliquables ;
- anomalies exportables ;
- impression exploitable ;
- validation terrain par un utilisateur magasinier.

## Prochaines actions

1. Tester l'HTML sur téléphone.
2. Corriger les libellés de zones selon le parc réel.
3. Remplacer les données fictives par les sources TFI V4.
4. Faire valider par les magasiniers.
5. Ajouter un mode inventaire si besoin.
