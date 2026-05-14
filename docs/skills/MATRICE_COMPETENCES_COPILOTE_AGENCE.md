# Matrice compétences — Copilote Chef d’Agence

Version : V1.0  
Statut : référentiel de pilotage  
Projet : Copilote Chef d’Agence / applications HTML métier  
Usage : identifier, prioriser et cadrer les compétences utiles au cas d’usage de Greg.

---

## 1. Objectif

Cette matrice sert à identifier les compétences réellement utiles pour construire, auditer et maintenir des applications HTML métier autonomes dans un contexte de négoce de matériaux.

Elle ne vise pas à lister toutes les compétences informatiques possibles. Elle sert à filtrer uniquement ce qui améliore :

- l’usage terrain réel ;
- la sécurité ;
- la fiabilité des données ;
- la simplicité d’exploitation ;
- la traçabilité ;
- la capacité à être repris par Codex, ChatGPT ou un développeur ;
- la robustesse des applications locales HTML/CSS/JS.

---

## 2. Cas d’usage cible

Le dépôt sert à développer des outils comme :

- stock mini/maxi ;
- cockpit chef d’agence ;
- zonage dépôt ;
- préparation commandes ;
- mapping TFI / ERP ;
- imports JSON / CSV ;
- exports de contrôle ;
- tableaux d’alertes ;
- aide à la décision avec validation humaine.

Contraintes prioritaires :

- zéro dépendance externe par défaut ;
- pas de CDN ;
- pas de framework inutile ;
- pas de secret dans le HTML ;
- pas de token, mot de passe, identifiant AS400, chaîne ODBC ou requête SQL sensible ;
- aucune écriture directe dans TFI / AS400 au départ ;
- validation humaine obligatoire ;
- données fictives ou anonymisées dans le dépôt ;
- séparation claire entre documentation, source, templates, données, exports et rapports.

---

## 3. Compétences prioritaires

| Priorité | Compétence | Utilité directe | Niveau cible |
|---|---|---|---|
| 1 | HTML/CSS/JS autonome | Créer des applications locales simples, robustes et sans dépendance | Fort |
| 2 | JSON Schema | Structurer et valider les imports/exports métier | Fort |
| 3 | Stock mini/maxi négoce | Calculer, contrôler et prioriser les réapprovisionnements | Fort |
| 4 | Mapping CSV / TFI | Préparer des exports contrôlés sans écriture directe ERP | Fort |
| 5 | Sécurité front-end | Empêcher les secrets et actions dangereuses côté navigateur | Fort |
| 6 | UX terrain mobile | Rendre les outils utilisables en agence, dépôt, comptoir | Fort |
| 7 | Recette GitHub Actions | Automatiser les contrôles avant diffusion | Moyen puis fort |
| 8 | Documentation exploitable IA | Permettre à Codex ou ChatGPT de comprendre et améliorer le dépôt | Fort |
| 9 | Automatisation Make / Power Automate | Déclencher des flux après stabilisation des fichiers | Moyen |
| 10 | Backend / API | À envisager plus tard, après validation métier | Faible maintenant |

---

## 4. Règle de décision

Une compétence est retenue uniquement si elle améliore au moins un critère opérationnel :

- moins d’erreurs terrain ;
- meilleure décision stock ;
- moins de risque sécurité ;
- meilleure traçabilité ;
- meilleur usage mobile ;
- meilleur import/export ;
- meilleure reprise par IA ou développeur ;
- meilleure validation humaine.

Si une compétence ajoute surtout de la complexité sans améliorer ces critères, elle est à reporter.

---

## 5. Compétences à éviter en V1 / V2

À ne pas prioriser maintenant :

- React complexe ;
- backend complet ;
- authentification multi-utilisateur ;
- base de données serveur ;
- connexion directe AS400 ;
- écriture automatique dans TFI ;
- IA autonome sans validation humaine ;
- API temps réel ;
- microservices ;
- dépendances externes non indispensables.

Ces compétences peuvent être utiles plus tard, mais elles ne doivent pas polluer la base actuelle.

---

## 6. Fiches skills associées

Les compétences sont détaillées dans les fichiers suivants :

```text
/docs/skills/01-skill-html-metier.md
/docs/skills/02-skill-json-schema.md
/docs/skills/03-skill-stock-mini-maxi.md
/docs/skills/04-skill-tfi-mapping.md
/docs/skills/05-skill-securite-html.md
/docs/skills/06-skill-ux-terrain-mobile.md
/docs/skills/07-skill-recette-github-actions.md
```

---

## 7. Critères de validation d’un nouveau module HTML métier

Avant de considérer un module comme exploitable, vérifier :

- le besoin métier est clair ;
- les utilisateurs cibles sont identifiés ;
- les données attendues sont listées ;
- le format d’import est documenté ;
- le format d’export est documenté ;
- les risques métier sont visibles ;
- les données sensibles sont absentes ;
- la validation humaine est prévue ;
- l’interface fonctionne sur mobile ;
- l’application peut être utilisée sans réseau ;
- l’export ou l’impression fonctionne si prévu ;
- un fichier exemple fictif existe ;
- une fiche projet existe ;
- une recette est possible.

---

## 8. Verdict

La compétence la plus utile pour ce dépôt n’est pas une compétence informatique isolée.

Le profil cible est :

> Analyste métier négoce matériaux + concepteur de données JSON/CSV + développeur HTML autonome + référent sécurité front + logique ERP/stock + UX terrain.

Cette matrice doit être utilisée comme filtre avant d’ajouter une nouvelle technologie, un nouveau module ou une nouvelle automatisation.