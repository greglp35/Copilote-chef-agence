// Source : 06_referentiel_metier.json — nommage canonique v1.4
// Ne pas modifier sans mise à jour du fichier de référence

export const STATUTS_COMMERCIAL = [
  'devis_a_envoyer',
  'devis_envoye',
  'confirme',
  'acompte_recu',
  'solde_recu',
  'archive',
  'perdu',
]

export const STATUTS_FACTURATION = [
  'non_emise',
  'emise',
  'partiellement_payee',
  'soldee',
]

export const STATUTS_EVENEMENT = [
  'a_venir',
  'en_cours',
  'termine',
  'annule',
]

export const TYPES_EVENEMENT = [
  'mariage',
  'anniversaire',
  'soiree_privee',
  'seminaire',
  'gala',
  'autre',
]

export const LABEL_STATUT_COMMERCIAL = {
  devis_a_envoyer: 'Devis à envoyer',
  devis_envoye: 'Devis envoyé',
  confirme: 'Confirmé',
  acompte_recu: 'Acompte reçu',
  solde_recu: 'Soldé',
  archive: 'Archivé',
  perdu: 'Perdu',
}

export const LABEL_STATUT_FACTURATION = {
  non_emise: 'Non émise',
  emise: 'Émise',
  partiellement_payee: 'Partiellement payée',
  soldee: 'Soldée',
}

export const LABEL_STATUT_EVENEMENT = {
  a_venir: 'À venir',
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
}

export const LABEL_TYPE_EVENEMENT = {
  mariage: 'Mariage',
  anniversaire: 'Anniversaire',
  soiree_privee: 'Soirée privée',
  seminaire: 'Séminaire',
  gala: 'Gala',
  autre: 'Autre',
}

// Statuts qui signifient "dossier clos"
export const STATUTS_CLOS = ['archive', 'perdu']

// Statuts qui comptent dans le CA confirmé YTD
export const STATUTS_CA_YTD = ['confirme', 'acompte_recu', 'solde_recu', 'archive']
