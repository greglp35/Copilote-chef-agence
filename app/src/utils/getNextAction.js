// Logique de recommandation — règle 37 §3 — Version de référence validée
// Priorité stricte : premier cas vrai = action retournée

import { diffDays, daysSince } from './dateUtils'

const NIVEAUX = {
  urgent: 'urgent',
  attention: 'attention',
  normal: 'normal',
  positif: 'positif',
  neutre: 'neutre',
}

export function getNextAction(dossier) {
  const d = dossier
  const jj = d.date_evenement ? diffDays(d.date_evenement) : null
  // Proxy pour "depuis l'envoi du devis" : jours écoulés depuis date_creation
  const depuisCreation = daysSince(d._meta?.date_creation)

  // P1 — Devis à envoyer
  if (d.statut_commercial === 'devis_a_envoyer') {
    return { label: 'Envoyer le devis', niveau: NIVEAUX.normal }
  }

  // P2 — Devis envoyé sans retour depuis > 7j
  if (d.statut_commercial === 'devis_envoye' && depuisCreation > 7) {
    return { label: 'Relancer le client', niveau: NIVEAUX.attention }
  }

  // P3 — Confirmé mais préparation incomplète
  if (d.statut_commercial === 'confirme' && (d.score_completude || 0) < 80) {
    return { label: 'Compléter la préparation', niveau: NIVEAUX.attention }
  }

  // P4 — Événement ≤ J+30, acompte non reçu, statut confirmé
  if (
    jj !== null &&
    jj <= 30 &&
    (!d.acompte_recu || d.acompte_recu === 0) &&
    d.statut_commercial === 'confirme'
  ) {
    return { label: "Relancer l'acompte", niveau: NIVEAUX.urgent }
  }

  // P5 — Événement ≤ J+30, solde non reçu, acompte déjà reçu
  if (
    jj !== null &&
    jj <= 30 &&
    (!d.solde_recu || d.solde_recu === 0) &&
    d.acompte_recu > 0
  ) {
    return { label: 'Relancer le solde', niveau: NIVEAUX.attention }
  }

  // P6 — Événement ≤ J+7, conducteur non validé
  if (jj !== null && jj <= 7 && !d.conducteur_ok) {
    return { label: 'Valider le conducteur de soirée', niveau: NIVEAUX.urgent }
  }

  // P7 — Événement ≤ J+2, préparation incomplète
  if (jj !== null && jj <= 2 && (d.score_completude || 0) < 100) {
    return { label: 'Finaliser la préparation — Jour J proche', niveau: NIVEAUX.urgent }
  }

  // P8 — Soldé
  if (d.statut_commercial === 'solde_recu') {
    return { label: 'Prestation soldée — demander un avis client', niveau: NIVEAUX.positif }
  }

  // P9 — Clôturé
  if (d.statut_commercial === 'archive' || d.statut_commercial === 'perdu') {
    return { label: 'Dossier clôturé — aucune action requise', niveau: NIVEAUX.neutre }
  }

  // Défaut
  return { label: "Dossier en cours — vérifier l'état", niveau: NIVEAUX.neutre }
}

export function isUrgent(dossier) {
  const d = dossier
  const jj = d.date_evenement ? diffDays(d.date_evenement) : null
  const p4 = jj !== null && jj <= 30 && (!d.acompte_recu || d.acompte_recu === 0) && d.statut_commercial === 'confirme'
  const p6 = jj !== null && jj <= 7 && !d.conducteur_ok
  const p7 = jj !== null && jj <= 2 && (d.score_completude || 0) < 100
  return p4 || p6 || p7
}
