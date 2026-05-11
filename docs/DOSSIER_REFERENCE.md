# Dossier de référence — Copilote Chef d'Agence

Version : V1.0  
Statut : socle projet  
Usage : cadrage, audit, génération et contrôle des applications HTML métier

## 1. Objectif

Le projet **Copilote Chef d'Agence** vise à construire une base de travail fiable pour piloter une agence de négoce de matériaux avec des outils simples, contrôlés et progressivement automatisables.

Le dépôt doit permettre de stocker :

- les sources des applications HTML métier ;
- les modèles de documents ;
- les schémas de données ;
- les rapports d'audit ;
- les règles de sécurité ;
- les workflows de contrôle GitHub Actions.

## 2. Principes directeurs

1. La sécurité passe avant l'automatisation.
2. La validation humaine reste obligatoire avant toute diffusion.
3. Les applications HTML métier doivent fonctionner simplement, idéalement en local/offline.
4. Les dépendances externes sont interdites par défaut.
5. Les données sensibles ne doivent jamais être placées dans le front.
6. Les exports CSV/JSON doivent être nettoyés avant intégration.
7. Chaque alerte ou recommandation doit être traçable.

## 3. Périmètre fonctionnel cible

Le dépôt peut progressivement accueillir des modules pour :

- audit HTML métier ;
- cockpit agence ;
- stock mini/maxi ;
- clients et relances ;
- devis et commandes ;
- sécurité agence ;
- journal de décisions ;
- irritants terrain ;
- exports JSON/CSV ;
- templates de rapports.

## 4. Règles de qualité

Chaque production doit distinguer :

- fait fourni ;
- hypothèse ;
- risque ;
- recommandation ;
- action prioritaire.

Chaque application HTML doit être :

- lisible ;
- responsive ;
- compréhensible en moins de 10 secondes ;
- exploitable sur mobile ;
- sécurisée côté données ;
- testable avec une checklist simple.

## 5. Validation humaine

Aucun workflow ne doit déployer ou modifier automatiquement une source critique sans validation humaine.

Le rôle du workflow est de contrôler, signaler, documenter et bloquer les risques évidents, pas de remplacer le jugement métier.
