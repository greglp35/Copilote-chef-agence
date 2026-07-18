# Matrice de sélection technique

Version : 1.0

| Besoin constaté | Solution native d'abord | Solution tierce retenue | Déclencheur d'adoption | Refus si |
|---|---|---|---|---|
| Formulaire simple | HTML natif | Aucune | Jamais sans besoin supplémentaire | Une bibliothèque ne fait qu'habiller les champs |
| Petit stockage local | localStorage | Aucune | Données simples et peu volumineuses | Relations, historique ou volume important |
| Stockage structuré local | IndexedDB | Dexie | Plusieurs tables, recherches, migrations | Sauvegarde/restauration non prévue |
| CSV simple | API File + parsing contrôlé | Papa Parse | CSV réels avec guillemets, séparateurs et volumes variables | Import sans aperçu ni rapport |
| JSON fiable | JSON.parse + contrôles simples | Ajv | Schémas métier versionnés | Erreurs non traduites pour l'utilisateur |
| Excel XLSX | Export CSV lorsque suffisant | ExcelJS | Styles, tables, plusieurs feuilles ou mise à jour XLSX | Le CSV couvre réellement le besoin |
| Formats tableurs variés | Aucun | SheetJS CE | Fichiers historiques non homogènes prouvés | ExcelJS suffit au périmètre validé |
| Tableau de moins de 200 lignes | table HTML | Aucune | Tri/filtre simple réalisé localement | Tabulator alourdit inutilement |
| Tableau riche/volumineux | table HTML optimisée | Tabulator | Édition, filtres, colonnes, gros volume | Accessibilité clavier non garantie |
| Planning métier | grille HTML | FullCalendar | Vues jour/semaine/mois et glisser-déposer nécessaires | Les conflits métier ne sont pas gérés |
| Liste réordonnable | boutons monter/descendre | SortableJS | Usage tactile fréquent | Pas d'alternative clavier |
| Éditeur visuel | CSS/Pointer Events | interact.js | Redimensionnement et magnétisme complexes | Utilisé sur un simple formulaire |
| Sauvegarde de fichier | lien Blob | browser-fs-access | Ouverture/écriture répétée utile | Solution de repli absente |
| Création PDF simple | impression navigateur | pdf-lib | Assemblage, pages ou formulaires PDF nécessaires | L'impression CSS produit le résultat attendu |
| QR code | service interdit | node-qrcode | QR généré localement requis | Donnée encodée non contrôlée |
| HTML riche importé | texte brut | DOMPurify | Contenu HTML indispensable | `innerHTML` est utilisé sans nécessité |
| Tests fonctionnels | scripts statiques | Playwright | Toujours pour les flux critiques | Un contrôle regex est présenté comme recette réelle |
| Accessibilité | checklist humaine | axe-core | Toujours dans la recette automatisée | Utilisé seul comme preuve de conformité |
| Performance | DevTools manuel | Lighthouse CI | Régressions possibles ou version hébergée | Score isolé sans scénario métier |
| SharePoint | export/import contrôlé | MSAL + Graph en V2 | Hébergement, Entra, droits et gouvernance validés | Page `file://`, secret front ou droits excessifs |

## Questions obligatoires avant adoption

1. Quel problème métier précis la dépendance résout-elle ?
2. Quelle solution native a été testée ?
3. Quel est le coût de maintenance et de retrait ?
4. La licence permet-elle l'usage prévu ?
5. Les données quittent-elles le poste ou le tenant Microsoft ?
6. Quels tests prouvent son bon fonctionnement ?
7. Quelle version exacte est autorisée ?
8. Qui valide la mise à jour future ?

## Arbitrage Excel

- Choisir CSV lorsque la structure est tabulaire, sans styles ni formules à préserver.
- Choisir ExcelJS lorsque le livrable doit être un vrai classeur XLSX structuré.
- Ajouter SheetJS CE seulement pour lire des fichiers hétérogènes non couverts correctement par le choix principal.
- Ne jamais laisser l'application deviner silencieusement le mapping d'un classeur maître.