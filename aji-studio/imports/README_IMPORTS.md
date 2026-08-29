# Imports AJI Studio

Ce dossier recoit les fichiers a importer dans AJI Studio.

## Fichiers attendus

- import produits JSON
- import produits CSV
- base publicite JSON
- catalogues numerotes JSON
- blocs modifiables JSON

## Regle de nommage

YYYY-MM-DD_nom_fichier_version.json

Exemple :
2026-05-15_import_publicite_v1.json

## Controle avant import

- le fichier est en UTF-8 ;
- le JSON est valide ;
- les produits ont un id stable ;
- les prix incertains restent bloques ;
- usage_public reste non tant que la validation n'est pas faite.
