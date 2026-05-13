# Mémoire des bonnes pratiques stock — Négoce de matériaux de construction

Version : V1.0  
Projet : Stock mini/maxi — Copilote Chef d'Agence  
Usage : base de connaissance interne, formation équipe, support GPT métier, Google Sheets, Glide, Make ou documentation agence.

---

## 0. Principe directeur

La gestion de stock en négoce matériaux ne doit pas être pensée uniquement article par article.

Elle doit répondre à une question terrain :

> Est-ce que l'agence peut servir le client avec une solution fiable, complète, localisée, préparée et sécurisée ?

Règle métier prioritaire :

> Article disponible ne veut pas dire chantier vendable.
> Chantier vendable = produit principal + accessoires + quantité suffisante + zone localisée + préparation possible.

---

## 1. Objectifs de la gestion de stock

| Objectif | Ce que cela veut dire terrain | Risque si non maîtrisé |
|---|---|---|
| Disponibilité | Le client trouve les produits courants et les chantiers réflexes sont couverts | Rupture, perte de vente, perte de confiance |
| Fiabilité | Le stock informatique correspond au stock physique | Promesse client fausse, erreur de commande |
| Rotation | Le stock tourne sans immobiliser trop de trésorerie | Surstock, dormant, dépréciation |
| Marge | Le stock sert à vendre mieux, pas à solder | Remises subies, perte de marge |
| Sécurité | Les produits sont stockés et manipulés sans danger | Accident, casse, non-conformité |
| Satisfaction client | Le client repart avec le bon produit ou une réponse fiable | Litige, chantier bloqué |
| Exploitation | Les équipes trouvent, préparent et rangent vite | Perte de temps, tensions internes |

---

## 2. Principes fondamentaux

| Principe | Règle terrain | Application concrète |
|---|---|---|
| Une entrée contrôlée | Rien ne doit être rangé sans contrôle | BL, référence, quantité, état, litige |
| Une sortie enregistrée | Tout produit sorti doit être tracé | Vente, transfert, casse, retour fournisseur |
| Un emplacement clair | Chaque article doit avoir une place connue | Zone, allée, travée, niveau, position |
| Un stock informatique fiable | Le système doit refléter le réel | Correction après analyse, pas au hasard |
| Une responsabilité définie | Chaque action stock a un responsable | Réception, rangement, inventaire, correction |
| Un inventaire régulier | La fiabilité se contrôle toute l'année | Inventaires tournants ABC |
| Une sécurité prioritaire | Aucun gain de temps ne justifie un risque | EPI, circulation, racks, charges |
| Une logique chantier | Le stock doit couvrir des lots complets | Produit principal + accessoires + consommables |

### Bonne pratique : ne jamais séparer stock physique et stock informatique

**Objectif :** éviter les promesses client fausses.

**Actions :**
1. Contrôler physiquement les entrées.
2. Enregistrer toutes les sorties.
3. Déclarer casse, retour, avarie ou erreur.
4. Rechercher la cause avant correction.
5. Utiliser les inventaires tournants pour fiabiliser.

**Exemple terrain :** le système indique 20 sacs de mortier, mais 8 sont abîmés et jamais sortis. Le client est annoncé servi alors que le stock réel ne le permet pas.

---

## 3. Organisation des familles produits

| Famille | Exemple produit | Unité de gestion | Risques stock | Bonnes pratiques |
|---|---|---|---|---|
| Gros œuvre | blocs, ciment, poutrelles | unité, palette, sac | casse, humidité, erreur palette | zone lourde, accès chariot, comptage palette + détail |
| Bois | chevrons, bastaings, OSB | pièce, ml, panneau | déformation, humidité, mélange longueurs | séparation sections, calage, étiquetage visible |
| Couverture | ardoises, écrans, crochets | palette, rouleau, boîte | casse, lots, accessoires oubliés | contrôle lot, stockage protégé, logique chantier |
| Isolation | laine, panneaux | rouleau, paquet, m² | humidité, écrasement, volume | stockage couvert, éviter compression, FIFO |
| Plaques de plâtre | BA13, hydro, feu | plaque, palette, m² | casse angles, humidité, basculement | stockage plat, protection, manutention adaptée |
| Carrelage | carreaux, colles, joints | boîte, m², sac | casse, nuance, bain | gérer lots/bains, contrôle casse, FIFO |
| Outillage | électroportatif | unité | vol, garantie, accessoire manquant | zone sécurisée, inventaire fréquent |
| Quincaillerie | vis, fixations | boîte, sachet, unité | petites pertes, mauvais bac | bacs identifiés, inventaire régulier |
| EPI | gants, lunettes, chaussures | unité, paire | taille manquante, usure | stock mini par taille, contrôle périodique |
| Produits chimiques | colles, mastics, adjuvants | cartouche, bidon, sac | péremption, fuite, incompatibilité | FDS, rétention, séparation, ventilation |
| Granulats / vrac | sable, gravier | tonne, m³, godet | mélange, erreur volume | cases identifiées, séparation nette |
| Menuiserie | portes, fenêtres | unité | rayure, casse, erreur dimension | stockage protégé, contrôle commande client |
| Aménagement extérieur | terrasse, clôture | m², ml, unité | saisonnalité, accessoires oubliés | packs chantier, anticipation saison |

---

## 4. Création et paramétrage des articles

Un article mal créé produit des erreurs pendant toute sa vie : mauvaise commande, mauvaise vente, mauvais stock, mauvaise marge, mauvaise préparation.

### Champs indispensables

| Champ | Rôle | Exemple |
|---|---|---|
| code_article | identifiant unique | PLA-BA13-250 |
| designation | libellé normalisé | Plaque BA13 standard 2500x1200 |
| fournisseur_principal | réapprovisionnement | Fournisseur X |
| unite_achat | commande fournisseur | palette |
| unite_vente | vente client | plaque ou m² |
| conditionnement | conversion | 60 plaques/palette |
| poids | manutention/livraison | 22 kg/plaque |
| volume | transport/stockage | 1 palette = X m³ |
| code_barres | scan/inventaire | EAN |
| famille | reporting/implantation | Plaque de plâtre |
| emplacement | localisation | DP-02-01 |
| mini | seuil d'alerte | 80 plaques |
| maxi | limite surstock | 180 plaques |
| delai_fournisseur | point de commande | 5 jours |
| statut | cycle de vie | actif/dormant/arrêté |
| rotation | pilotage ABC | A/B/C |
| contraintes_qhse | stockage/sécurité | humidité, danger, poids |

### Modèle de fiche article

| Rubrique | À renseigner |
|---|---|
| Code article |  |
| Désignation complète |  |
| Famille / sous-famille |  |
| Fournisseur principal |  |
| Fournisseur secondaire |  |
| Unité d'achat |  |
| Unité de vente |  |
| Conversion achat/vente |  |
| Conditionnement fournisseur |  |
| Mini |  |
| Maxi |  |
| Stock sécurité |  |
| Délai fournisseur |  |
| Franco / minimum commande |  |
| Emplacement principal |  |
| Emplacement secondaire |  |
| Produit équivalent |  |
| Produit complémentaire |  |
| Produit obligatoire chantier type | oui/non |
| Contraintes stockage |  |
| Contraintes manutention |  |
| Statut | actif / à surveiller / dormant / arrêté |
| Date dernière revue |  |
| Responsable validation |  |

---

## 5. Référencement fournisseur et achats

Le stock se fiabilise dès l'achat.

### Données fournisseur à maîtriser

- délai moyen ;
- délai réel observé ;
- franco ;
- minimum de commande ;
- multiple de commande ;
- conditionnement ;
- produit équivalent ;
- conditions de retour ;
- fiabilité livraison ;
- suivi des reliquats.

### Checklist avant commande fournisseur

| Point à vérifier | OK | Commentaire |
|---|---:|---|
| Stock disponible sous mini ou proche point de commande |  |  |
| Commandes en cours vérifiées |  |  |
| Réservations clients intégrées |  |  |
| Multiple fournisseur respecté |  |  |
| Franco atteint ou assumé |  |  |
| Maxi non dépassé sans raison |  |  |
| Produit toujours actif |  |  |
| Couverture chantier type vérifiée |  |  |
| Équivalent vérifié |  |  |
| Validation responsable |  |  |

### Règle importante

Ne jamais commander uniquement :

> maxi - stock

Il faut aussi vérifier :

- multiple achat ;
- franco ;
- stock réservé ;
- commandes en cours ;
- saisonnalité ;
- couverture chantier ;
- place disponible ;
- risque dormant.

---

## 6. Réception marchandises

### Procédure complète

1. Préparer la réception : zone libre, commande disponible, moyen de manutention.
2. Contrôler le BL : fournisseur, numéro, référence, quantité, reliquat.
3. Contrôler les quantités : palette, colis, sacs, bottes, longueurs, m², ml.
4. Contrôler la qualité : casse, humidité, film, rouille, date, choc.
5. Gérer les litiges : réserve BL, photos, isolement, information achat/admin.
6. Saisir informatiquement : uniquement après contrôle réel.
7. Étiqueter : article, emplacement, lot, date si FIFO.
8. Ranger : emplacement prévu, zone temporaire limitée.

### Checklist réception

| Contrôle | OK | Anomalie | Action |
|---|---:|---:|---|
| Fournisseur conforme |  |  |  |
| Commande trouvée |  |  |  |
| BL présent |  |  |  |
| Références contrôlées |  |  |  |
| Quantités contrôlées |  |  |  |
| État visuel contrôlé |  |  |  |
| Lots/bains vérifiés si nécessaire |  |  |  |
| Réserves émises si besoin |  |  |  |
| Photos prises si litige |  |  |  |
| Saisie après contrôle |  |  |  |
| Produit rangé au bon emplacement |  |  |  |

---

## 7. Rangement et implantation

| Règle | Application terrain |
|---|---|
| Forte rotation proche préparation | visserie, sacs courants, plaques fréquentes |
| Produits lourds accessibles engins | blocs, mortiers, big bags, bois lourd |
| Produits fragiles protégés | plaques, carrelage, menuiserie |
| Produits sensibles à l'humidité couverts | ciment, isolation, enduits |
| Produits dangereux isolés | chimiques, adjuvants, inflammables |
| Produits saisonniers en zone dédiée | terrasse, clôture, aménagement extérieur |
| Produits complémentaires rapprochés | plaques + rails + montants + vis + bandes |
| Zone préparation distincte | éviter mélange stock vendable / commande client |

### Tableau d'implantation

| Type de produit | Zone recommandée | Risques | Règles de stockage |
|---|---|---|---|
| Sacs ciment/mortier | dépôt couvert sec | humidité, sacs percés | palette, protection, FIFO |
| Plaques de plâtre | dépôt couvert plat | casse, humidité | stockage stable, protection angles |
| Bois | cour ou couvert | vrillage, mélange | séparation sections, calage |
| Isolation | dépôt couvert | humidité, écrasement | hauteur limitée, pas de compression |
| Carrelage | zone sèche stable | casse, nuance | par lot/bain, contrôle cartons |
| Produits chimiques | local dédié | fuite, incompatibilité | FDS, rétention, ventilation |
| Granulats | cases extérieures | mélange, pollution | séparation et identification |
| Quincaillerie | libre-service/réserve | vol, erreur picking | bacs étiquetés, inventaire fréquent |

---

## 8. Gestion des emplacements

### Codification simple

Format complet :

`Bâtiment - Allée - Travée - Niveau - Position`

Exemple : `DP-A03-T02-N1-P04`

Format court compatible terrain :

`DP0301`

Lecture :

- `DP` = dépôt ;
- `03` = allée ou zone ;
- `01` = travée ou position.

### Règles

1. Un article = un emplacement principal.
2. Un emplacement secondaire doit être déclaré.
3. Les zones temporaires doivent être limitées dans le temps.
4. Tout déplacement durable doit être mis à jour.
5. Les zones litige, casse, retour et préparation doivent être séparées.
6. Un produit introuvable déclenche une fiche écart.

---

## 9. Stockage par typologie de produit

### Sacs ciment / mortier / enduit

À faire :
- stocker au sec ;
- garder sur palette ;
- appliquer FIFO ;
- isoler sacs durcis, humides ou percés ;
- déclarer casse immédiatement.

### Plaques de plâtre

À faire :
- stocker couvert et stable ;
- protéger les angles ;
- séparer BA13, hydro, feu, phonique ;
- contrôler avant chargement ;
- éviter les manipulations répétées.

### Bois et panneaux

À faire :
- séparer dimensions et sections ;
- stocker sur supports adaptés ;
- éviter mélange longueurs ;
- contrôler vrillage et humidité ;
- remettre les retours en stock seulement après contrôle.

### Isolation

À faire :
- stocker sec et couvert ;
- éviter l'écrasement ;
- identifier épaisseur, R, largeur ;
- surveiller accessoires : suspentes, adhésifs, membranes.

### Carrelage

À faire :
- gérer bains et nuances ;
- contrôler casse ;
- ne pas mélanger lots sans validation ;
- vérifier quantité chantier complète.

### Couverture

À faire :
- protéger produits fragiles ;
- suivre les accessoires bloquants ;
- raisonner chantier complet ;
- photographier anomalie réception.

### Granulats et vrac

À faire :
- identifier les cases ;
- éviter les mélanges ;
- définir méthode de conversion tonne/m³/godet ;
- contrôler les sorties atypiques.

### Produits chimiques

À faire :
- conserver étiquetage ;
- tenir FDS accessibles ;
- séparer incompatibles ;
- utiliser rétention si nécessaire ;
- vérifier dates ;
- signaler fuite immédiatement.

### Menuiseries

À faire :
- protéger rayures et chocs ;
- vérifier dimensions ;
- séparer commande client et stock vendable ;
- conserver emballage.

### Outillage

À faire :
- sécuriser produits sensibles ;
- contrôler accessoires ;
- inventorier fréquemment ;
- vérifier garantie ou numéro si utile.

### Quincaillerie

À faire :
- bacs étiquetés ;
- mini visuel ;
- inventaires courts et fréquents ;
- rapprochement des accessoires chantier.

### EPI

À faire :
- stock par taille ;
- contrôle état ;
- remplacement si usé ;
- traçabilité distribution si nécessaire.

### Produits longs

À faire :
- stocker sur racks adaptés ;
- identifier longueurs ;
- éviter dépassement en allée ;
- respecter charges admissibles.

### Palettes lourdes

À faire :
- vérifier état palette ;
- stocker lourd en bas ;
- interdire palette instable en hauteur ;
- protéger pieds de racks.

---

## 10. Sorties de stock et préparation commandes

### Bonnes pratiques

1. Préparer uniquement sur bon fiable.
2. Vérifier référence, quantité, unité.
3. Séparer commandes clients et stock disponible.
4. Utiliser une zone préparation identifiée.
5. Valider toute substitution.
6. Respecter FIFO.
7. Marquer les manquants.
8. Ne jamais annoncer complet si une ligne obligatoire manque.
9. Contrôler avant remise ou livraison.

### Checklist préparation

| Étape | OK | Commentaire |
|---|---:|---|
| Bon lisible |  |  |
| Client / chantier identifié |  |  |
| Références vérifiées |  |  |
| Quantités vérifiées |  |  |
| Unités contrôlées |  |  |
| Produits fragiles protégés |  |  |
| Substitution validée |  |  |
| Manquants signalés |  |  |
| Zone dépose renseignée |  |  |
| Contrôle final fait |  |  |

---

## 11. Chargement client et livraison

### Règles

- contrôler le bon avant chargement ;
- vérifier cohérence véhicule / charge ;
- charger dans l'ordre logique ;
- protéger les produits fragiles ;
- séparer produits incompatibles ;
- caler et arrimer ;
- faire signer ou valider la remise ;
- documenter toute anomalie.

| Point | Règle |
|---|---|
| Charge utile | ne pas dépasser la capacité utile |
| Arrimage | calage et maintien des charges |
| Fragile | protection renforcée |
| Lourd | bonne répartition |
| Chantier | accès vérifié si nécessaire |
| Anomalie | photo + réserve + signalement |

---

## 12. Retours clients et reprises fournisseurs

### Procédure retour client

1. Identifier client, facture ou bon.
2. Contrôler état produit.
3. Vérifier standard ou commande spéciale.
4. Décider : remise stock, avoir, rebut, litige.
5. Isoler en zone retour.
6. Enregistrer informatiquement.
7. Remettre en stock seulement si vendable.

### Tableau de décision

| Situation | Action | Validation nécessaire | Impact stock |
|---|---|---|---|
| Produit intact standard | remise en stock | vendeur/responsable | stock + |
| Produit abîmé | casse/rebut | responsable | pas de stock vendable |
| Commande spéciale | refus ou accord spécifique | chef agence | selon décision |
| Produit incomplet | litige/reprise partielle | responsable | stock bloqué |
| Erreur agence | avoir + correction | chef agence/admin | correction contrôlée |
| Retour fournisseur accepté | zone reprise fournisseur | achats/responsable | sortie après enlèvement |

---

## 13. Inventaires tournants

### Classification ABC

| Classe | Type produit | Fréquence recommandée |
|---|---|---|
| A | forte valeur / forte rotation | mensuelle |
| B | rotation moyenne | trimestrielle |
| C | faible valeur | semestrielle |
| Sensible | vol, danger, accessoire bloquant | mensuelle ou bimensuelle |
| Dormant | non tournant | revue trimestrielle |

### Méthode

1. Définir zone/famille.
2. Limiter mouvements.
3. Compter physiquement.
4. Comparer au système.
5. Recompter si écart.
6. Analyser la cause.
7. Corriger après validation.
8. Créer action corrective.

### Planning type mensuel

| Semaine | Familles | Responsable | Livrable |
|---|---|---|---|
| S1 | quincaillerie, EPI, outillage | magasinier + vendeur | écarts + actions |
| S2 | plaques, rails, montants, accessoires | responsable dépôt | couverture chantier cloison |
| S3 | ciment, mortier, granulats | magasinier cour | écarts lourds |
| S4 | bois, terrasse, couverture | responsable exploitation | dormants + saisonniers |

---

## 14. Inventaire annuel

### Préparation

- nettoyer les zones ;
- ranger les produits ;
- traiter retours ;
- déclarer casse ;
- isoler litiges ;
- identifier réservations clients ;
- bloquer ou limiter mouvements ;
- préparer listings ;
- répartir les équipes ;
- prévoir recomptage.

### Checklist inventaire annuel

| Point | OK |
|---|---:|
| Zones nettoyées |  |
| Produits rangés |  |
| Retours traités |  |
| Casse déclarée |  |
| Litiges isolés |  |
| Réservations identifiées |  |
| Listings prêts |  |
| Équipes affectées |  |
| Règles expliquées |  |
| Recompte prévu |  |
| Validation finale définie |  |

---

## 15. Gestion des écarts de stock

### Causes fréquentes

| Cause | Exemple |
|---|---|
| Erreur réception | BL saisi à 60, reçu 54 |
| Erreur préparation | 12 servis, 10 facturés |
| Casse non déclarée | sacs jetés sans sortie |
| Retour non traité | produit remis mais pas saisi |
| Vol | outillage/quincaillerie |
| Mauvais emplacement | article présent mais introuvable |
| Unité incorrecte | vente m², stock plaque |
| Conversion erronée | palette/carton/unité |
| Doublon article | deux codes pour même produit |
| Réservation oubliée | stock présent mais affecté client |

### Méthode des 5 pourquoi

1. Pourquoi le stock est faux ?
2. Pourquoi cet écart existe ?
3. Pourquoi la cause n'a pas été détectée ?
4. Pourquoi la procédure ne l'a pas empêché ?
5. Quelle action empêche la répétition ?

### Fiche écart

| Champ | À remplir |
|---|---|
| Date |  |
| Article |  |
| Famille |  |
| Emplacement |  |
| Stock système |  |
| Stock physique |  |
| Écart |  |
| Valeur estimée |  |
| Cause probable |  |
| Cause confirmée |  |
| Action corrective |  |
| Responsable |  |
| Date correction |  |
| Validation |  |

---

## 16. Stock dormant, obsolète et déprécié

| Terme | Définition terrain |
|---|---|
| Stock lent | tourne moins que prévu |
| Stock dormant | sans vente depuis une période définie |
| Stock mort | sans perspective réaliste de vente |
| Stock obsolète | remplacé, non conforme ou dépassé |
| Stock déprécié | valeur réelle inférieure à valeur stock |

### Actions

| Situation | Action |
|---|---|
| Produit vendable | mise en avant / relance |
| Utile autre agence | transfert inter-agence |
| Reprenable fournisseur | retour fournisseur |
| Complémentaire | substitution commerciale |
| Saisonnier | opération ciblée |
| Abîmé | déclassement / rebut |
| Non stratégique | arrêt référencement |

### Suivi dormant

| Article | Famille | Valeur | Dernière vente | Quantité | Cause | Action | Responsable | Date limite |
|---|---|---:|---|---:|---|---|---|---|

---

## 17. Seuils mini/maxi et stock de sécurité

### Formule simple

> Point de commande = consommation moyenne pendant le délai fournisseur + stock de sécurité

### Exemple

Mortier sac 25 kg :

- vente moyenne : 5 sacs/jour ;
- délai fournisseur : 6 jours ;
- stock sécurité : 20 sacs.

Consommation pendant délai = 5 x 6 = 30 sacs.  
Point de commande = 30 + 20 = 50 sacs.

Quand le stock disponible projeté descend à 50 sacs, il faut déclencher une action.

### Mini métier chantier

Pour les articles stratégiques :

> Mini utile = maximum entre mini calculé par rotation et quantité nécessaire pour couvrir au moins un chantier standard.

Exemple : cloison BA13 50 m² = plaques + rails + montants + vis + bandes + enduit.

---

## 18. Indicateurs de pilotage stock

| Indicateur | Formule | Fréquence | Objectif | Responsable |
|---|---|---:|---|---|
| Taux de rupture | articles en rupture / articles suivis | hebdo | baisser | chef agence |
| Taux disponibilité | articles disponibles / articles demandés | hebdo | monter | chef agence |
| Rotation stock | coût vendu / stock moyen | mensuel | optimiser | chef agence |
| Couverture stock | stock dispo / conso moyenne | hebdo | maîtriser | responsable dépôt |
| Valeur stock | somme valeur articles | mensuel | suivre | chef agence |
| Stock dormant | valeur sans vente X mois | mensuel | réduire | commerce + exploitation |
| Écarts inventaire | écart valeur / valeur comptée | mensuel | réduire | responsable dépôt |
| Démarque | pertes non expliquées / stock | mensuel | réduire | chef agence |
| Taux service | commandes servies complètes / demandes | hebdo | monter | vente + dépôt |
| Litiges réception | litiges / réceptions | mensuel | réduire | réception |
| Avoirs erreurs stock | avoirs erreurs / avoirs totaux | mensuel | réduire | admin + commerce |
| Chantiers vendables | chantiers types complets disponibles | quotidien/hebdo | monter | chef agence |

---

## 19. Rituels de pilotage

### Quotidien magasin/cour

- Durée : 10 min.
- Participants : responsable dépôt, magasiniers, vendeur si besoin.
- Données : réceptions, préparations, ruptures visibles, anomalies sécurité.
- Décisions : priorités rangement, zones à libérer, urgences client.
- Livrable : 3 priorités du jour.

### Hebdomadaire stock

- Durée : 30 à 45 min.
- Participants : chef agence, dépôt, commerce.
- Données : sous mini, ruptures, surstocks, écarts, dormants.
- Décisions : commandes, transferts, corrections, inventaires tournants.
- Livrable : plan d'action hebdo.

### Mensuel agence

- Durée : 60 min.
- Participants : chef agence, commerce, exploitation, administratif.
- Données : valeur stock, rotation, marge, dormants, litiges.
- Décisions : déréférencement, opérations, nettoyage base article.
- Livrable : tableau de bord mensuel.

### Trimestriel dormants

- Durée : 60 à 90 min.
- Participants : chef agence, commerce, achats si possible.
- Données : stock dormant, obsolète, faible rotation.
- Décisions : promo, transfert, retour fournisseur, arrêt.
- Livrable : plan liquidation maîtrisé.

---

## 20. Rôles et responsabilités RACI

R = réalise. A = responsable final. C = consulté. I = informé.

| Activité | Chef agence | Resp. dépôt | Magasinier | Vendeur | Commercial | Appro | Chauffeur | Admin |
|---|---|---|---|---|---|---|---|---|
| Création article | A | C | C | C | C | R | I | C |
| Mini/maxi | A | C | C | C | C | R | I | I |
| Commande fournisseur | A | C | I | C | C | R | I | C |
| Réception | I | A | R | I | I | C | C | C |
| Litige réception | A | R | R | I | I | C | I | C |
| Rangement | I | A | R | I | I | I | I | I |
| Préparation | I | A | R | C | C | I | C | I |
| Chargement | I | A | R | C | I | I | C/R | I |
| Livraison | I | C | C | I | I | I | R | C |
| Retour client | A | R | R | C | C | I | C | C |
| Inventaire tournant | A | R | R | C | I | I | I | I |
| Correction écart | A | R | C | C | I | I | I | C |
| Stock dormant | A | C | I | C | R/C | C | I | C |
| Sécurité stockage | A | R | R | I | I | I | C | I |

---

## 21. QHSE et sécurité

### Règles essentielles

| Risque | Règle terrain |
|---|---|
| Circulation engins/piétons | séparer flux, signaler, limiter vitesse |
| Stockage hauteur | charges admissibles visibles, palettes stables |
| Charges lourdes | moyens adaptés, pas d'improvisation |
| Produits dangereux | FDS, étiquetage, séparation, rétention |
| EPI | disponibilité, port selon poste, remplacement |
| Signalétique | zones, risques, sens de circulation visibles |
| Racks | contrôle état, aplomb, chocs, ancrage |
| Palettes | refuser palette instable en hauteur |
| Incendie | issues libres, extincteurs accessibles |
| Humidité | produits sensibles protégés |
| Propreté | allées dégagées, pas de stockage sauvage |

### Checklist sécurité stock

| Point | OK | Action |
|---|---:|---|
| Allées dégagées |  |  |
| Issues secours libres |  |  |
| Extincteurs accessibles |  |  |
| Racks sans choc visible |  |  |
| Charges admissibles affichées |  |  |
| Palettes stables |  |  |
| Produits lourds en bas |  |  |
| Produits chimiques identifiés |  |  |
| FDS accessibles |  |  |
| EPI disponibles |  |  |
| Zones piétons respectées |  |  |
| Zone casse/litige séparée |  |  |
| Sol propre |  |  |
| Signalétique lisible |  |  |

---

## 22. Formation des nouveaux collaborateurs

### Parcours en 5 jours

| Jour | Thème | Objectifs | Validation |
|---|---|---|---|
| 1 | Découverte agence et sécurité | zones, flux, EPI, circulation | visite + quiz sécurité |
| 2 | Familles produits | familles, unités, risques | reconnaissance produits |
| 3 | Réception/rangement | BL, quantité, qualité, emplacement | réception accompagnée |
| 4 | Préparation/chargement | préparer juste, contrôler, sécuriser | préparation supervisée |
| 5 | Inventaire/écarts | compter, expliquer, déclarer | comptage test + fiche écart |

### Grille acquis

| Compétence | Acquis | À renforcer | Non acquis |
|---|---:|---:|---:|
| Connaît les zones agence |  |  |  |
| Porte les EPI adaptés |  |  |  |
| Lit un bon de préparation |  |  |  |
| Contrôle une réception |  |  |  |
| Identifie un produit abîmé |  |  |  |
| Déclare une casse |  |  |  |
| Respecte les emplacements |  |  |  |
| Prépare sans substitution non validée |  |  |  |
| Comprend stock physique vs informatique |  |  |  |
| Sait quand alerter |  |  |  |

---

## 23. Automatisation et outils digitaux

### Tables recommandées

| Table | Utilité | Champs clés |
|---|---|---|
| Articles | base produit | code, désignation, famille, unité, mini, maxi, emplacement, fournisseur |
| Emplacements | plan dépôt/parc | code, zone, allée, travée, niveau, capacité, risque |
| Mouvements | historique stock | date, article, type, quantité, origine, destination, utilisateur |
| Inventaires | comptages | date, zone, article, stock système, stock compté, écart |
| Écarts | analyse causes | article, écart, cause, action, responsable, statut |
| Fournisseurs | achats | délai, franco, mini commande, conditionnement, contact |
| Retours | retours clients | client, article, état, décision, impact stock |
| Litiges | réception/fournisseur | fournisseur, article, quantité, photo, réserve, statut |
| Actions correctives | amélioration continue | problème, action, responsable, échéance, résultat |
| Chantiers types | couverture chantier | chantier, surface, article, quantité, obligatoire, remplacement |

### Automatisations utiles

- alerte article sous mini ;
- alerte produit dormant ;
- formulaire casse avec photo ;
- QR code emplacement ;
- inventaire mobile ;
- suivi litiges réception ;
- tableau de bord hebdo ;
- export JSON/CSV pour application HTML.

---

## 24. Checklists opérationnelles

### Ouverture dépôt

- allées dégagées ;
- engins contrôlés visuellement ;
- zones réception/préparation libres ;
- produits dangereux sans anomalie ;
- racks sans choc nouveau ;
- priorités du jour connues.

### Réception

- BL contrôlé ;
- quantité comptée ;
- état contrôlé ;
- réserve si besoin ;
- photos si litige ;
- saisie après contrôle ;
- rangement fait.

### Rangement

- bon emplacement ;
- étiquette visible ;
- produit stable ;
- allée libre ;
- emplacement mis à jour.

### Préparation

- bon fiable ;
- référence contrôlée ;
- quantité contrôlée ;
- manquant signalé ;
- substitution validée ;
- zone préparation renseignée.

### Chargement

- bon vérifié ;
- ordre de chargement correct ;
- produit protégé ;
- charge cohérente ;
- arrimage/calage vérifié ;
- client informé.

### Retour client

- facture vérifiée ;
- état contrôlé ;
- décision prise ;
- zone retour utilisée ;
- stock mis à jour.

### Casse

- produit isolé ;
- photo prise ;
- cause renseignée ;
- sortie stock validée ;
- action corrective si répétitif.

### Inventaire tournant

- zone définie ;
- comptage fait ;
- recomptage si écart ;
- cause analysée ;
- correction validée.

### Fermeture dépôt

- zones propres ;
- commandes préparées identifiées ;
- retours isolés ;
- produits sensibles sécurisés ;
- engins stationnés ;
- anomalies remontées.

---

## 25. Procédures standardisées prêtes à afficher

### Procédure réception

1. Identifier la commande.
2. Contrôler le BL.
3. Compter.
4. Contrôler l'état.
5. Mettre réserve si anomalie.
6. Photographier.
7. Saisir le réel reçu.
8. Étiqueter.
9. Ranger.
10. Signaler litige.

### Procédure sortie stock

1. Lire le bon.
2. Vérifier article.
3. Vérifier quantité.
4. Prélever.
5. Contrôler unité.
6. Déposer en zone préparation.
7. Signaler manquant.
8. Valider sortie.

### Procédure correction écart

1. Constater écart.
2. Recompter.
3. Vérifier mouvements récents.
4. Chercher mauvais emplacement.
5. Identifier cause.
6. Faire valider.
7. Corriger système.
8. Créer action corrective.

### Procédure produit cassé

1. Isoler produit.
2. Photographier.
3. Identifier article et quantité.
4. Déterminer cause.
5. Déclarer casse.
6. Sortir du stock vendable.
7. Décider rebut, déclassement ou litige.
8. Analyser répétition.

### Procédure retour client

1. Vérifier facture.
2. Contrôler état.
3. Identifier standard ou spécifique.
4. Décider remise stock / avoir / refus / litige.
5. Enregistrer.
6. Ranger ou isoler.
7. Informer vendeur.

### Procédure inventaire tournant

1. Choisir famille ou zone.
2. Prévenir équipe.
3. Compter.
4. Comparer.
5. Recompter si écart.
6. Analyser.
7. Corriger après validation.
8. Suivre action.

### Procédure stock dormant

1. Extraire liste sans vente.
2. Classer par valeur.
3. Vérifier état physique.
4. Choisir action.
5. Fixer responsable et échéance.
6. Suivre baisse stock.
7. Déréférencer si nécessaire.

---

## 26. Les 20 règles d'or du stock en négoce matériaux

1. Un produit non contrôlé ne doit pas être rangé.
2. Un produit sorti doit être enregistré.
3. Un retour client ne retourne jamais en stock sans contrôle.
4. Un emplacement faux crée un stock faux.
5. Un article disponible ne signifie pas qu'un chantier est vendable.
6. Le produit principal ne suffit pas : les accessoires bloquants comptent autant.
7. Les unités achat, vente et stock doivent être parfaitement maîtrisées.
8. Le mini/maxi doit respecter les multiples fournisseurs.
9. Le stock sécurité doit couvrir les délais et les aléas réels.
10. Les produits sensibles à l'humidité doivent être protégés avant tout.
11. Les produits lourds doivent être stockés et manutentionnés avec des moyens adaptés.
12. Les produits dangereux doivent être identifiés, séparés et documentés.
13. Les racks doivent être surveillés, protégés et jamais surchargés.
14. Les inventaires tournants valent mieux qu'un grand inventaire subi.
15. Un écart doit être expliqué avant d'être corrigé.
16. Le stock dormant doit être traité avant de devenir invisible.
17. La préparation commande doit être contrôlée avant remise client.
18. La sécurité prime toujours sur la vitesse.
19. Chaque anomalie répétée doit produire une action corrective.
20. Le meilleur stock est celui qui rend le client fiable sur son chantier, sans immobiliser inutilement l'argent de l'agence.

---

## 27. Utilisation dans le projet mini/maxi stock

Cette mémoire doit alimenter :

- `src/stock-mini-maxi.html` : règles mini/maxi, seuils, alertes, surstock, dormant ;
- `src/couverture-chantier.html` : logique chantier complet ;
- `src/plan-parc-magasinier.html` : emplacement, sécurité, préparation terrain ;
- `src/preparation-commandes-client.html` : contrôle avant remise client ;
- `data/stock-mini-maxi.schema.json` : champs obligatoires article ;
- `data/chantiers-types-source.csv` : couverture chantier ;
- futurs tableaux Google Sheets / Glide / Make.

Verdict : cette mémoire devient la base métier stock du projet mini/maxi. Elle doit être utilisée comme référence avant toute modification fonctionnelle liée au stock.