# Copilote-chef-agence
Assistant IA pour le pilotage d'une agence tout faire matériaux automatisation to do analyse et support 

## Socle projet Copilote Chef d'Agence

Ce dépôt sert de base de travail pour le projet **Copilote Chef d'Agence**.

Objectif : construire progressivement une base robuste pour des applications HTML métier, des workflows de contrôle, des rapports d'audit, des modèles de données et des assistants IA utiles au pilotage d'une agence de négoce de matériaux.

Principes prioritaires :

- sécurité avant automatisation ;
- validation humaine obligatoire avant diffusion ou mise en production ;
- zéro dépendance externe par défaut pour les applications HTML métier ;
- aucun secret, token, mot de passe, identifiant AS400, chaîne ODBC ou requête SQL sensible dans le HTML ;
- séparation entre sources, données, exports, rapports et documentation ;
- traçabilité des décisions et des corrections.

## Structure projet cible

```text
/docs       Documentation, règles, dossiers de référence
/src        Sources applicatives HTML/CSS/JS
/templates  Modèles réutilisables
/exports    Exports générés ou exemples non sensibles
/rapports   Rapports d'audit et de contrôle
/data       Schémas JSON/CSV et données de test non sensibles
```

## HTML “Claude‑IA friendly”

Règles à appliquer par défaut dans tout code HTML généré ou corrigé :

1) Sémantique  
   - Utiliser : header, nav, main, article, section, footer, plutôt que div.  
   - Un seul H1 par page, hiérarchie H2–H3–H4 cohérente.  

2) Accessibilité basique  
   - Tous les <img> doivent avoir un alt explicite.  
   - Les boutons/liens doivent avoir un texte clair.  

3) Balises pour l’IA et les moteurs  
   - <title> unique et descriptif.  
   - <meta name="description"> approprié.  
   - Schema.org en JSON‑LD si demandé (Organization, Product, Article, FAQ, etc.).  

4) Traçabilité  
   - Ajouter des commentaires dans le HTML :  
     - <!-- AUDIT SEO / IA : [mot‑clé] -->  
     - <!-- MAJ : [date] - changement depuis Screaming Frog report X -->  

## Audit HTML avec Screaming Frog

Quand l'utilisateur demande un audit HTML avec Screaming Frog, suis ce canevas :

1) Demande d’information initiale  
   - Si l’URL n’est pas fournie, demander :  
     - URL racine du site.  
     - Type de site (corporate, e‑commerce, blog, etc.).  
     - Version du plan Claude (Pro / Max).  

2) Analyse des onglets Screaming Frog  
   Pour chaque onglet, produire :  
   - Une **liste structurée** des problèmes.  
   - Des **recommandations** sous forme de code HTML ou de consignes CMS.  

2.1) Overview  
   - Identifier :  
     - Nombre d’URLs.  
     - % de pages ayant des erreurs métas / H1.  
   - Interpréter :  
     - “Ce site a X % de pages sans H1 : c’est un problème de structure sémantique.”

2.2) Page Titles / Meta Description  
   - Sortie :  
     - Tableau (CSV) : URL, status (absent / dupliqué / bon), nouvelle valeur recommandée.  

2.3) Headings  
   - Sortie :  
     - Lister :  
       - Pages sans H1.  
       - Pages avec plusieurs H1.  
       - Hiérarchies H1–H2–H3 incohérentes.  

2.4) Images  
   - Sortie :  
     - CSV : URL, src de l’image, alt actuel, alt recommandé.  

2.5) Response Codes  
   - Trier les erreurs par type : 404, 500, redirections en chaîne.  
   - Proposer :  
     - Supprimer, corriger ou rediriger.  

3) Format de livrable  
   - Toujours :  
     - Séparer en sections (Overview, Titles, Headings, Images, Links, Errors).  
     - Donner un exemple de HTML corrigé pour chaque type de problème.  
     - Proposer un **template de CSV** à exporter dans Screaming Frog / Excel.  

## Travail avec Claude sur l’HTML

1. PLAN (diagnostic)  
   - Liste tous les problèmes détectés dans Screaming Frog (erreurs, alertes, warnings).  
   - Ordonne les problèmes par priorité :  
     - Sécurité / breaking bugs (404 critiques, canonicité cassée).  
     - SEO / IA (titres, H1, meta, schema).  
     - UX / accessibilité (balises sémantiques, images, contrastes).  

2. EXECUTE (actions concrètes)  
   - Pour chaque point :  
     - Donner :  
       - URL cible.  
       - type d’erreur (ex. “H1 manquant”).  
       - recommandation précise (ex. “Ajoute un H1 unique avec phrase clé : ‘…’”).  
     - Proposer un **code HTML** exact à injecter / modifier.  

3. VERIFY (traçabilité)  
   - Fournir un **rapport de suivi** :  
     - “Before” / “After” HTML.  
     - Date, version du projet.  
   - Si possible, exporter un CSV compatible avec Screaming Frog (colonnes : URL, type_problème, recommandation, priorité).

# Cadre : audit et optimisation HTML avec Screaming Frog

Objectif :  
- Aider [ton nom / ton équipe] à auditer et corriger le HTML de [nom du site] (site e‑commerce, corporatif, blog, etc.).  
- Produire des recommandations claires, traçables et exécutables pour Claude.  
- Fournir un format structuré (liste, CSV, rapports) utilisable directement dans Screaming Frog, Excel ou le CMS.