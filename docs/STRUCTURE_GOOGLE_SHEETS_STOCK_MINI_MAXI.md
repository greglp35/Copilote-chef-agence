# Structure Google Sheets — Stock mini/maxi négoce matériaux

Version : V1.0  
Projet : Stock mini/maxi — Copilote Chef d'Agence  
Objectif : fournir une structure propre, exploitable et contrôlable pour alimenter les modules stock, couverture chantier, plan parc, préparation commande, inventaires, écarts et actions correctives.

---

## 1. Principes de conception

La base Google Sheets doit rester simple, lisible et exploitable par une équipe terrain.

Règles prioritaires :

1. Une table = un usage clair.
2. Un identifiant stable par ligne.
3. Aucune donnée sensible inutile.
4. Aucun mot de passe, token, identifiant AS400 ou chaîne ODBC.
5. Les exports doivent pouvoir être utilisés en CSV ou JSON.
6. Les champs obligatoires doivent être renseignés avant exploitation.
7. La validation humaine reste obligatoire avant commande, correction stock ou annonce client.

---

## 2. Onglets recommandés

| Onglet | Rôle | Priorité |
|---|---|---|
| Articles | Base article principale | haute |
| Fournisseurs | Données achats et approvisionnement | haute |
| Emplacements | Localisation dépôt/parc/magasin | haute |
| Mouvements | Historique des entrées/sorties | haute |
| Inventaires | Comptages tournants et annuels | haute |
| Ecarts | Analyse des écarts de stock | haute |
| Chantiers_types | Composition des chantiers standards | haute |
| Retours | Retours clients | moyenne |
| Litiges | Litiges réception/fournisseur | moyenne |
| Actions_correctives | Suivi amélioration continue | moyenne |
| KPI_stock | Tableau de bord | moyenne |
| Parametres | Listes de valeurs et règles | moyenne |

---

## 3. Onglet Articles

### Objectif

Centraliser les données nécessaires au pilotage mini/maxi, à la disponibilité, à la couverture chantier et à la préparation.

### Champs recommandés

| Champ | Type | Obligatoire | Exemple | Usage |
|---|---|---:|---|---|
| id_article | texte | oui | ART-0001 | identifiant interne stable |
| code_article | texte | oui | PLA-001 | code métier ou ERP |
| designation | texte | oui | Plaque BA13 standard | lecture utilisateur |
| famille | texte | oui | Plaque de plâtre | filtre et reporting |
| sous_famille | texte | non | BA13 standard | précision métier |
| fournisseur_principal | texte | oui | Fournisseur X | réapprovisionnement |
| unite_achat | texte | oui | palette | commande fournisseur |
| unite_vente | texte | oui | plaque | vente client |
| coefficient_conversion | nombre | oui | 60 | conversion achat/vente |
| conditionnement | texte | oui | 60 plaques/palette | contrôle commande |
| poids_unitaire | nombre | non | 22 | manutention/livraison |
| volume_unitaire | nombre | non | 0.05 | stockage/livraison |
| code_barres | texte | non | 123456789 | scan |
| emplacement_principal | texte | oui | DP0201 | localisation |
| emplacement_secondaire | texte | non | LS0101 | débord ou picking |
| stock_physique | nombre | oui | 140 | stock réel système |
| stock_reserve | nombre | oui | 30 | réservé client |
| commandes_en_cours | nombre | oui | 50 | attendu fournisseur |
| vente_30j | nombre | oui | 90 | vitesse courte |
| vente_90j | nombre | oui | 260 | vitesse moyenne |
| delai_fournisseur_jours | nombre | oui | 5 | point commande |
| mini | nombre | oui | 80 | seuil mini |
| maxi | nombre | oui | 180 | seuil maxi |
| stock_securite | nombre | non | 20 | tampon |
| multiple_achat | nombre | oui | 10 | arrondi commande |
| classe_abc | texte | non | A | fréquence inventaire |
| statut_article | texte | oui | actif | actif / dormant / arrêté |
| produit_remplacement | texte | non | PLA-ALT | substitution possible |
| contrainte_qhse | texte | non | lourd / humidité | sécurité |
| date_derniere_revue | date | non | 2026-05-13 | gouvernance |

### Champs calculés recommandés

| Champ calculé | Formule métier |
|---|---|
| stock_disponible | stock_physique - stock_reserve |
| stock_projete | stock_physique - stock_reserve + commandes_en_cours |
| conso_jour | max(vente_30j / 30 ; vente_90j / 90) |
| point_commande | conso_jour x delai_fournisseur_jours + stock_securite |
| besoin_theorique | max(0 ; mini - stock_projete) |
| quantite_recommandee | besoin_theorique arrondi au multiple_achat supérieur |
| statut_stock | OK / SOUS_MINI / A_COMMANDER / SURSTOCK / INCOMPATIBLE |

---

## 4. Onglet Fournisseurs

| Champ | Type | Obligatoire | Exemple |
|---|---|---:|---|
| id_fournisseur | texte | oui | FOU-001 |
| nom_fournisseur | texte | oui | Fournisseur X |
| contact | texte | non | commercial@exemple.fr |
| delai_standard_jours | nombre | oui | 7 |
| delai_reel_observe_jours | nombre | non | 9 |
| franco | nombre | non | 800 |
| minimum_commande | nombre | non | 250 |
| unite_franco | texte | non | euros |
| conditions_retour | texte | non | accord préalable |
| fiabilite | texte | non | bonne / moyenne / faible |
| commentaire | texte | non |  |

---

## 5. Onglet Emplacements

| Champ | Type | Obligatoire | Exemple |
|---|---|---:|---|
| id_emplacement | texte | oui | EMP-001 |
| code_emplacement | texte | oui | DP0201 |
| libelle_zone | texte | oui | Dépôt couvert plaques |
| batiment | texte | non | dépôt |
| allee | texte | non | 02 |
| travee | texte | non | 01 |
| niveau | texte | non | bas |
| position | texte | non | P04 |
| famille_autorisee | texte | non | Plaque de plâtre |
| famille_interdite | texte | non | VRD |
| capacite | texte | non | 4 palettes |
| niveau_risque | texte | oui | faible / moyen / élevé / bloquant |
| statut_emplacement | texte | oui | actif / saturé / bloqué / à revoir |
| commentaire | texte | non |  |

---

## 6. Onglet Mouvements

| Champ | Type | Obligatoire | Exemple |
|---|---|---:|---|
| id_mouvement | texte | oui | MVT-0001 |
| date_mouvement | date/heure | oui | 2026-05-13 08:15 |
| code_article | texte | oui | PLA-001 |
| type_mouvement | texte | oui | réception / vente / casse / retour / transfert / correction |
| quantite | nombre | oui | 10 |
| unite | texte | oui | plaque |
| origine | texte | non | fournisseur / emplacement |
| destination | texte | non | client / emplacement |
| utilisateur | texte | oui | prénom |
| justificatif | texte | non | BL / facture / fiche écart |
| commentaire | texte | non |  |

---

## 7. Onglet Inventaires

| Champ | Type | Obligatoire | Exemple |
|---|---|---:|---|
| id_inventaire | texte | oui | INV-0001 |
| date_comptage | date | oui | 2026-05-13 |
| type_inventaire | texte | oui | tournant / annuel |
| zone | texte | oui | DP0201 |
| code_article | texte | oui | PLA-001 |
| stock_systeme | nombre | oui | 140 |
| stock_compte | nombre | oui | 138 |
| ecart_quantite | nombre | oui | -2 |
| compteur_1 | texte | oui | magasinier |
| compteur_2 | texte | non | responsable |
| statut_validation | texte | oui | à analyser / validé / corrigé |
| commentaire | texte | non |  |

---

## 8. Onglet Ecarts

| Champ | Type | Obligatoire | Exemple |
|---|---|---:|---|
| id_ecart | texte | oui | ECA-0001 |
| date_constat | date | oui | 2026-05-13 |
| code_article | texte | oui | VIS-500 |
| famille | texte | oui | Quincaillerie |
| emplacement | texte | oui | LS0101 |
| stock_systeme | nombre | oui | 12 |
| stock_physique | nombre | oui | 8 |
| ecart_quantite | nombre | oui | -4 |
| ecart_valeur | nombre | non | 32 |
| cause_probable | texte | oui | sortie non enregistrée |
| cause_confirmee | texte | non | accessoire ajouté sans pointage |
| action_corrective | texte | oui | créer zone accessoires contrôlée |
| responsable | texte | oui | responsable dépôt |
| statut | texte | oui | ouvert / en cours / clôturé |

---

## 9. Onglet Chantiers_types

Cet onglet alimente directement la logique : chantier vendable.

| Champ | Type | Obligatoire | Exemple |
|---|---|---:|---|
| chantier_type | texte | oui | cloison_ba13 |
| surface_reference | texte | oui | 50m2 |
| code_article | texte | oui | PLA-001 |
| designation | texte | oui | Plaque BA13 standard |
| famille | texte | oui | Plaque de plâtre |
| quantite_pour_surface | nombre | oui | 50 |
| unite | texte | oui | m2 |
| obligatoire | texte | oui | oui / non |
| produit_remplacement | texte | non | BANDE-ALT |
| priorite | texte | oui | haute / moyenne / basse |
| role_chantier | texte | oui | produit_principal / structure / accessoire_bloquant / fixation / option |
| commentaire | texte | non | produit bloquant si absent |

---

## 10. Onglet Retours

| Champ | Type | Obligatoire | Exemple |
|---|---|---:|---|
| id_retour | texte | oui | RET-0001 |
| date_retour | date | oui | 2026-05-13 |
| client | texte | non | client X |
| code_article | texte | oui | CAR-001 |
| quantite | nombre | oui | 3 |
| facture_ou_bl | texte | non | FAC-123 |
| etat_produit | texte | oui | intact / abîmé / incomplet |
| decision | texte | oui | remise_stock / avoir / rebut / litige / refus |
| impact_stock | texte | oui | stock+ / aucun / stock bloqué |
| validation | texte | oui | vendeur / responsable / chef agence |

---

## 11. Onglet Litiges

| Champ | Type | Obligatoire | Exemple |
|---|---|---:|---|
| id_litige | texte | oui | LIT-0001 |
| date_litige | date | oui | 2026-05-13 |
| fournisseur | texte | oui | Fournisseur X |
| code_article | texte | oui | COU-001 |
| type_litige | texte | oui | casse / manquant / erreur référence / retard |
| quantite | nombre | oui | 2 |
| reserve_bl | texte | non | réserve notée sur BL |
| photo | texte | non | lien ou nom fichier |
| statut | texte | oui | ouvert / transmis / résolu / refusé |
| action | texte | non | relance fournisseur |

---

## 12. Onglet Actions_correctives

| Champ | Type | Obligatoire | Exemple |
|---|---|---:|---|
| id_action | texte | oui | ACT-0001 |
| date_creation | date | oui | 2026-05-13 |
| origine | texte | oui | écart / casse / litige / QHSE / dormant |
| probleme | texte | oui | erreurs répétées sur visserie |
| action | texte | oui | créer emplacement accessoire chantier |
| responsable | texte | oui | responsable dépôt |
| echeance | date | oui | 2026-05-20 |
| statut | texte | oui | à faire / en cours / fait / abandonné |
| resultat | texte | non | écart réduit |

---

## 13. Onglet KPI_stock

| Champ | Type | Exemple |
|---|---|---|
| date_kpi | date | 2026-05-13 |
| taux_rupture | nombre | 4.5 |
| taux_disponibilite | nombre | 95.5 |
| rotation_stock | nombre | 4.2 |
| couverture_stock_jours | nombre | 38 |
| valeur_stock | nombre | 450000 |
| valeur_stock_dormant | nombre | 28000 |
| ecarts_inventaire_valeur | nombre | 1200 |
| taux_service | nombre | 93 |
| litiges_reception | nombre | 3 |
| chantiers_vendables_aujourdhui | nombre | 8 |
| commentaire | texte |  |

---

## 14. Onglet Parametres

À utiliser pour les listes déroulantes :

- familles produits ;
- statuts articles ;
- types mouvements ;
- statuts stock ;
- niveaux risques ;
- rôles chantier ;
- priorités ;
- causes écarts ;
- décisions retours ;
- statuts actions.

---

## 15. Règles de validation conseillées

| Champ | Règle |
|---|---|
| code_article | unique, non vide |
| code_emplacement | format stable, non vide |
| mini | nombre >= 0 |
| maxi | nombre >= mini |
| multiple_achat | nombre > 0 |
| statut_article | liste contrôlée |
| obligatoire | oui/non |
| priorite | haute/moyenne/basse |
| date | format date |

---

## 16. Ordre de construction recommandé

1. Créer les onglets Articles, Fournisseurs, Emplacements.
2. Importer un échantillon de données fictives.
3. Valider unités achat / vente / conversion.
4. Ajouter mini, maxi, délai, multiple achat.
5. Ajouter Chantiers_types.
6. Ajouter Inventaires et Ecarts.
7. Ajouter Retours, Litiges, Actions_correctives.
8. Créer KPI_stock.
9. Exporter CSV/JSON vers les modules HTML.
10. Tester avec le hub `src/pilotage-stock-chantier.html`.

---

## 17. Verdict senior

La structure Google Sheets ne doit pas devenir une usine à gaz. Elle doit d'abord fiabiliser les fondamentaux : articles, emplacements, mini/maxi, mouvements, inventaires, écarts et chantiers types.

Automatiser avant d'avoir ces données propres serait une erreur. La priorité est la qualité de la donnée, puis l'alerte, puis l'automatisation.