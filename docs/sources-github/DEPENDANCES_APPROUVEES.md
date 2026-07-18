# Registre des dépendances approuvées

Version : 1.0  
Statut : à valider avant intégration en production

## Règles générales

Toute dépendance doit être figée, documentée, testée et conservée localement ou installée au moment de la construction. Aucun chargement CDN n'est autorisé par défaut dans les applications métier.

| Besoin | Projet recommandé | Statut | Usage autorisé | Conditions |
|---|---|---:|---|---|
| Tests navigateur | Microsoft Playwright | P0 | Recette automatisée Chromium, Firefox, WebKit | Scénarios métier, traces et captures en cas d'échec |
| Accessibilité | axe-core | P0 | Contrôles WCAG automatisés | Compléter par une vérification humaine clavier et lecteur d'écran |
| Validation JSON | Ajv | P0 | Validation par JSON Schema | Schémas versionnés, erreurs compréhensibles par l'utilisateur |
| Import/export CSV | Papa Parse | P0 | Lecture, génération, détection de séparateur | Prévisualisation avant import, encodage UTF-8, journal d'erreurs |
| XLSX structuré | ExcelJS | P1 | Création et modification de classeurs Excel | Choix principal ; tests de compatibilité avec Excel Microsoft 365 |
| Import tableurs hétérogènes | SheetJS CE | Conditionnel | Lecture de formats variés | Ne pas cumuler avec ExcelJS sans preuve de besoin |
| Base locale | Dexie | P1 | Couche IndexedDB | Migration de schéma, export de secours JSON, purge contrôlée |
| Ouverture/enregistrement fichiers | browser-fs-access | P1 | File System Access API avec repli | Tester Chrome, Edge et navigateur sans API native |
| Audit performance | Lighthouse CI | P1 | Budget performance et accessibilité | Exécution sur version hébergée ou serveur local contrôlé |
| Tableaux riches | Tabulator | Conditionnel | Tri, filtres, édition, export | À réserver aux écrans où un tableau natif devient insuffisant |
| Planning | FullCalendar | Conditionnel | Planning et glisser-déposer | Règles métier et conflits validés côté application |
| Réordonnancement | SortableJS | Conditionnel | Listes et priorités | Clavier et alternative accessible obligatoires |
| Déplacement/redimensionnement | interact.js | Conditionnel | Éditeurs visuels | À isoler des écrans de saisie métier standards |
| PDF | pdf-lib | Conditionnel | Assemblage et modification PDF | Vérifier formats, polices, impression et poids des fichiers |
| Nettoyage HTML | DOMPurify | Conditionnel | Contenu HTML importé ou riche | Ne remplace pas l'encodage de sortie ni la CSP |
| QR codes | node-qrcode | Conditionnel | Génération de QR locaux | Valeur encodée vérifiée et test d'impression réel |
| Authentification Microsoft | MSAL Browser | V2 | Connexion Entra ID | Hébergement HTTPS, app enregistrée, permissions déléguées |
| Excel SharePoint | Microsoft Graph JS SDK | V2 | Lecture/écriture Graph | Aucun secret front, journalisation, gestion concurrence et reprise |
| Référence UI | emilkowalski/skills | Référence | Audit animations et qualité UI | Ne pas intégrer comme dépendance d'exécution |

## Bibliothèques refusées par défaut

- dépendances sans licence claire ;
- projets non maintenus pour une fonction critique ;
- scripts copiés depuis un CDN sans version figée ;
- composants nécessitant un secret dans le navigateur ;
- bibliothèques redondantes avec une solution déjà approuvée ;
- frameworks lourds pour une application HTML métier simple.

## Procédure d'ajout

1. Décrire le besoin non couvert.
2. Comparer au moins une solution native et une solution tierce.
3. Vérifier licence, maintenance, vulnérabilités et poids.
4. Créer un prototype isolé.
5. Ajouter tests et procédure de retrait.
6. Mettre à jour ce registre.
7. Obtenir une validation humaine avant diffusion.