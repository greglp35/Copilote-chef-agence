# Fiche projet — [nom-du-projet]

Version : V1.0  
Statut : brouillon | en cadrage | valide | bloque | archive  
Responsable validation : [nom]
Date de creation : [AAAA-MM-JJ]
Derniere mise a jour : [AAAA-MM-JJ]

## 1. Nom du projet

[nom clair du projet]

## 2. Probleme terrain a resoudre

Décrire le blocage concret observe sur le terrain.

Exemples :

- perte de temps ;
- manque de visibilité ;
- erreur récurrente ;
- absence de suivi ;
- information difficile à retrouver ;
- risque sécurité ;
- rupture de méthode.

## 3. Utilisateur cible

Qui va utiliser l'outil ?

- chef d'agence ;
- vendeur comptoir ;
- magasinier ;
- commercial ;
- responsable transport ;
- équipe administrative ;
- autre.

## 4. Objectif operationnel

Formuler le résultat attendu en une phrase claire.

> L'outil doit permettre de [...], afin de [...].

## 5. Donnees utilisees

Lister les données nécessaires.

| Donnee | Source | Sensible | Commentaire |
|---|---|---|---|
| [exemple] | [manuelle / CSV / JSON / export nettoye] | oui / non | [precision] |

## 6. Regles de securite

Cocher ou confirmer les règles suivantes :

- [ ] Aucun mot de passe dans le HTML.
- [ ] Aucun token dans le HTML.
- [ ] Aucun identifiant AS400 dans le HTML.
- [ ] Aucune chaine ODBC dans le HTML.
- [ ] Aucune requete SQL sensible dans le HTML.
- [ ] Donnees de test fictives ou anonymisees.
- [ ] Validation humaine obligatoire avant diffusion.

## 7. Fonctionnalites attendues

Lister uniquement les fonctions utiles à la V1.

| Priorite | Fonctionnalite | Description | Statut |
|---|---|---|---|
| haute | [fonction] | [description] | a faire |

## 8. Hors perimetre

Ce que l'outil ne doit pas faire en V1.

- [exemple : ne pas ecrire dans l'ERP]
- [exemple : ne pas remplacer une validation humaine]

## 9. Critères de réussite

Définir des critères mesurables ou observables.

- [ ] L'utilisateur comprend l'outil en moins de 10 secondes.
- [ ] L'outil fonctionne sur mobile.
- [ ] Les données ne sont pas perdues après rafraîchissement si sauvegarde attendue.
- [ ] L'export ou l'impression fonctionne si prévu.
- [ ] La recette GitHub Actions passe.

## 10. Risques et points fragiles

| Risque | Niveau | Parade |
|---|---|---|
| [risque] | faible / moyen / fort / bloquant | [parade] |

## 11. Validation humaine

Nom du validateur : [nom]  
Date de validation : [AAAA-MM-JJ]  
Décision : valide | a corriger | bloque  
Commentaire : [commentaire]

## 12. Lien avec les fichiers source

Fichier HTML principal : `src/[nom-du-projet].html`  
Fichier JSON projet : `projets/[nom-du-projet].json`  
Rapport attendu : artifact GitHub Actions

## 13. Prochaines actions

1. [action prioritaire]
2. [action suivante]
3. [action de validation]
