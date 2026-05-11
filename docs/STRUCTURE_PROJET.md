# Structure projet — Copilote Chef d'Agence

## Arborescence cible

```text
/docs
/src
/templates
/exports
/rapports
/data
.github/workflows
```

## Rôle des dossiers

### /docs

Contient la documentation de référence :

- dossier de référence ;
- règles de sécurité ;
- structure projet ;
- cahiers des charges ;
- journaux de décision.

### /src

Contient les sources des applications HTML métier :

- fichiers `.html` ;
- fichiers `.css` ;
- fichiers `.js` ;
- composants ou modules locaux.

### /templates

Contient les modèles réutilisables :

- templates HTML ;
- modèles JSON ;
- modèles de rapports ;
- modèles de fiche projet.

### /exports

Contient uniquement des exports non sensibles :

- exemples CSV ;
- exemples JSON ;
- exports nettoyés ;
- fichiers générés destinés à contrôle.

### /rapports

Contient les rapports générés ou archivés :

- audits HTML ;
- contrôles structure ;
- rapports de recette ;
- synthèses de vérification.

### /data

Contient les schémas et jeux de données de test :

- schemas JSON ;
- exemples CSV ;
- données fictives ;
- dictionnaires métier.

## Règle de nommage

Utiliser de préférence :

```text
kebab-case.ext
snake_case.ext
```

Éviter :

- espaces ;
- accents ;
- caractères spéciaux ;
- noms trop longs ;
- versions floues du type final_final_v8.

## Règle de livraison

Avant diffusion d'un outil HTML métier :

1. contrôle structure projet ;
2. audit HTML métier ;
3. vérification sécurité ;
4. test mobile ;
5. validation humaine ;
6. archivage du rapport.
