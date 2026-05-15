# Utiliser le Hub Applications Métier

Version : V1.0  
Application : `src/hub-applications.html`

---

## Objectif

Le hub sert de point d’entrée unique pour ouvrir les applications HTML métier du dépôt.

Il permet de :

- rechercher une application ;
- filtrer par catégorie ;
- filtrer par rôle ;
- filtrer par statut ;
- marquer des favoris ;
- ouvrir une application en nouvel onglet ;
- prévisualiser une application dans le hub ;
- exporter ou importer la configuration locale.

---

## Utilisation rapide

1. Ouvrir `src/hub-applications.html` dans un navigateur.
2. Utiliser la recherche ou les filtres.
3. Cliquer sur `Ouvrir` pour lancer une application.
4. Cliquer sur `Aperçu` pour l’afficher dans le hub.
5. Utiliser `Favori` pour mémoriser les applications fréquentes.

---

## Important

Les rôles affichés dans le hub sont uniquement des filtres visuels.

Ils ne remplacent pas une authentification ni une vraie gestion des droits.

---

## Sauvegarde

Les favoris et les applications ajoutées sont stockés localement dans le navigateur.

Pour conserver la configuration :

1. Cliquer sur `Export config`.
2. Sauvegarder le fichier JSON.
3. Utiliser `Import config` pour restaurer la configuration.

---

## Limites V1

Le hub ne modifie pas le dépôt.

Le catalogue embarqué doit être mis à jour lorsqu’une nouvelle application structurante est ajoutée.