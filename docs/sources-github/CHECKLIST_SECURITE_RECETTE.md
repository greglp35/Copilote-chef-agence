# Checklist sécurité et recette

Version : 1.0  
Usage : à joindre au rapport de recette de chaque module.

## A. Sources et périmètre

- [ ] Les documents métier utilisés sont identifiés et versionnés.
- [ ] Les hypothèses sont séparées des faits fournis.
- [ ] Le périmètre autorisé est explicite.
- [ ] L'ERP TFI/MTX reste la vérité officielle.
- [ ] Le rôle du classeur Excel SharePoint maître est documenté.
- [ ] Aucune fonctionnalité hors périmètre n'a été ajoutée silencieusement.

## B. Secrets et connexions

- [ ] Aucun mot de passe, token, secret client ou clé API dans le dépôt.
- [ ] Aucun identifiant AS400, ODBC ou chaîne SQL sensible dans le front.
- [ ] Aucun appel direct non autorisé vers l'ERP.
- [ ] Aucune synchronisation cachée.
- [ ] Les domaines réseau autorisés sont documentés.
- [ ] Les permissions Microsoft éventuelles respectent le moindre privilège.

## C. Dépendances

- [ ] Chaque dépendance figure dans `DEPENDANCES_APPROUVEES.md`.
- [ ] La version ou le commit est figé.
- [ ] La licence est compatible avec le projet.
- [ ] Aucun CDN d'exécution non approuvé.
- [ ] La dépendance est contrôlée contre les vulnérabilités connues.
- [ ] Une procédure de mise à jour et de retrait existe.

## D. Données

- [ ] Les données d'entrée sont validées avant usage.
- [ ] Les schémas JSON sont versionnés.
- [ ] Les imports CSV/XLSX ont une prévisualisation.
- [ ] Les doublons et colonnes absentes sont détectés.
- [ ] Les formules CSV dangereuses sont neutralisées.
- [ ] Les dates, décimales et encodages français sont testés.
- [ ] Les erreurs n'entraînent aucune perte silencieuse.
- [ ] Une sauvegarde et une restauration ont été testées.

## E. Droits et actions critiques

- [ ] Les profils autorisés sont définis.
- [ ] Les boutons interdits sont masqués ou désactivés selon le profil.
- [ ] Une confirmation est demandée avant suppression ou écriture critique.
- [ ] Les actions importantes sont journalisées.
- [ ] Le journal ne collecte pas de données personnelles inutiles.
- [ ] La validation humaine reste obligatoire avant diffusion ou écriture centrale.

## F. Sécurité front

- [ ] Les textes externes sont rendus avec `textContent` par défaut.
- [ ] Tout usage de `innerHTML` est justifié et sécurisé.
- [ ] Les fichiers importés sont contrôlés par type, taille et contenu.
- [ ] Les URL et liens externes sont validés.
- [ ] Les erreurs techniques détaillées ne sont pas exposées à l'utilisateur final.
- [ ] Une politique CSP est prévue pour les versions hébergées.

## G. Tests fonctionnels Playwright

- [ ] Chargement sans erreur JavaScript.
- [ ] Navigation principale.
- [ ] Création d'un enregistrement.
- [ ] Modification d'un enregistrement.
- [ ] Annulation d'une modification.
- [ ] Suppression contrôlée ou archivage.
- [ ] Import valide.
- [ ] Import invalide.
- [ ] Prévisualisation et confirmation.
- [ ] Export CSV/JSON/XLSX selon périmètre.
- [ ] Sauvegarde et restauration.
- [ ] Rechargement navigateur sans perte inattendue.
- [ ] Test Chromium.
- [ ] Test Firefox.
- [ ] Test WebKit.

## H. Accessibilité et UX

- [ ] Un seul H1 et structure sémantique cohérente.
- [ ] Navigation complète au clavier.
- [ ] Focus visible.
- [ ] Libellés explicites pour tous les champs.
- [ ] Messages d'erreur reliés aux champs concernés.
- [ ] Contraste vérifié.
- [ ] Zoom 200 % exploitable.
- [ ] Mode mobile ou petit écran exploitable.
- [ ] axe-core sans violation critique.
- [ ] Les animations respectent `prefers-reduced-motion`.
- [ ] L'écran principal est compréhensible en moins de dix secondes.

## I. Excel et SharePoint

- [ ] Le mapping colonnes ↔ champs est signé.
- [ ] Les tables nommées et feuilles attendues sont contrôlées.
- [ ] La structure du classeur n'est jamais modifiée sans validation.
- [ ] Les nombres, dates, formules et styles sont préservés selon le besoin.
- [ ] Un fichier réel de test autorisé a été utilisé.
- [ ] Le résultat a été ouvert et contrôlé dans Excel Microsoft 365.
- [ ] Pour Graph : HTTPS, MSAL, Entra ID et permissions déléguées sont validés.
- [ ] Pour Graph : conflits, délais, erreurs et révocation sont testés.

## J. Livraison

- [ ] Version et date visibles.
- [ ] Journal des changements fourni.
- [ ] Rapport de tests archivé.
- [ ] Limites connues documentées.
- [ ] Procédure utilisateur fournie.
- [ ] Procédure de retour arrière fournie.
- [ ] Validation métier humaine obtenue.
- [ ] Aucun déploiement automatique d'une source critique sans approbation.