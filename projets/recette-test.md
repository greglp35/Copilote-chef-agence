# Fiche projet — recette-test

Version : V1.0  
Statut : valide  
Responsable validation : Greg  
Date de creation : 2026-05-11  
Derniere mise a jour : 2026-05-11

## 1. Nom du projet

Recette test HTML métier

## 2. Probleme terrain a resoudre

Le dépôt a besoin d'un fichier HTML simple permettant de tester les workflows de recette avant d'intégrer de vraies applications métier.

Sans fichier de test, les workflows peuvent être créés mais leur comportement réel reste moins vérifiable.

## 3. Utilisateur cible

- chef d'agence ;
- développeur ou assistant IA ;
- utilisateur chargé de valider le socle projet.

## 4. Objectif operationnel

> L'outil doit permettre de vérifier automatiquement la recette HTML de base, afin de valider que le dépôt contrôle correctement les applications métier avant diffusion.

## 5. Donnees utilisees

| Donnee | Source | Sensible | Commentaire |
|---|---|---|---|
| Nom du projet test | saisie manuelle | non | donnée fictive |
| Note de contrôle | saisie manuelle | non | donnée fictive |
| Date de sauvegarde | navigateur | non | générée localement |

## 6. Regles de securite

- [x] Aucun mot de passe dans le HTML.
- [x] Aucun token dans le HTML.
- [x] Aucun identifiant AS400 dans le HTML.
- [x] Aucune chaine ODBC dans le HTML.
- [x] Aucune requete SQL sensible dans le HTML.
- [x] Donnees de test fictives ou anonymisees.
- [x] Validation humaine obligatoire avant diffusion.

## 7. Fonctionnalites attendues

| Priorite | Fonctionnalite | Description | Statut |
|---|---|---|---|
| haute | Sauvegarde locale | Vérifier localStorage | fait |
| haute | Export JSON | Vérifier création d'un export local | fait |
| moyenne | Impression | Vérifier le mode print | fait |
| moyenne | Responsive | Vérifier viewport et CSS mobile | fait |
| moyenne | Accessibilité minimale | Vérifier labels, rôles, focus | fait |

## 8. Hors perimetre

- Ne pas gérer de vraies données métier.
- Ne pas se connecter à l'ERP.
- Ne pas appeler une API externe.
- Ne pas remplacer une application métier finale.

## 9. Critères de réussite

- [x] L'utilisateur comprend l'outil en moins de 10 secondes.
- [x] L'outil fonctionne sur mobile.
- [x] Les données ne sont pas perdues après rafraîchissement si sauvegarde attendue.
- [x] L'export ou l'impression fonctionne si prévu.
- [x] La recette GitHub Actions passe.

## 10. Risques et points fragiles

| Risque | Niveau | Parade |
|---|---|---|
| Confondre page de test et vraie application | faible | nommer clairement le fichier recette-test |
| Croire que la recette automatique remplace le test humain | moyen | rappeler la validation humaine |
| Ajouter plus tard des données réelles dans cette page | moyen | conserver des données fictives uniquement |

## 11. Validation humaine

Nom du validateur : Greg  
Date de validation : 2026-05-11  
Décision : valide  
Commentaire : fichier de test accepté pour vérifier les workflows du socle projet.

## 12. Lien avec les fichiers source

Fichier HTML principal : `src/recette-test.html`  
Fichier JSON projet : `projets/recette-test.json`  
Rapport attendu : artifact GitHub Actions

## 13. Prochaines actions

1. Utiliser ce fichier comme témoin de recette.
2. Ajouter les vraies applications métier dans `/src`.
3. Créer une fiche projet pour chaque application réelle.
