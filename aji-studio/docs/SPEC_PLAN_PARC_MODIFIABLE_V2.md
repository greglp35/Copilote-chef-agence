# Plan parc modifiable V2 - specification terrain

Objectif : permettre au responsable depot / magasinier de modifier le plan du parc sans coder.

## Fonctions attendues

- Mode consultation et mode modification.
- Selection d'une zone sur le plan.
- Deplacement d'une zone par glisser-deposer.
- Redimensionnement d'une zone.
- Modification du code zone TFI, nom, type, statut, risque, couleur, familles et consignes.
- Ajout d'une zone.
- Duplication d'une zone.
- Suppression d'une zone.
- Import et export JSON du plan.
- Sauvegarde locale navigateur.
- Export anomalies terrain CSV.
- Export controle securite CSV.
- Impression du plan.

## Regle TFI

Le champ code_zone_tfi doit rester sur 6 caracteres sans tiret.

Exemple : CR0101.
Affichage possible : CR-01-01.

## Garde-fous terrain

- Une zone securite ou bloquante doit etre validee humainement.
- Le plan est une aide operationnelle, pas un document reglementaire unique.
- Toute modification importante doit etre exportee en JSON et versionnee.

## Prochaine integration

Remplacer le fichier src/plan-parc-magasinier.html par la version V2 modifiable apres test terrain.
