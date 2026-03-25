// lib/rules.js — Logique métier getNextAction
// Règle 37 §3 — 9 priorités figées — ne pas modifier sans mise à jour du fichier de référence

import { diffDays, daysSince } from './dates'

/** Retourne { label, niveau } pour un dossier.
 *  niveau : 'urgent' | 'attention' | 'normal' | 'positif' | 'neutre'
 */
export function getNextAction(dossier) {
  const d = dossier
  const jj = d.date_evenement ? diffDays(d.date_evenement) : null
  const depuisCreation = daysSince(d._meta?.date_creation)

  // P1
  if (d.statut_commercial === 'devis_a_envoyer')
    return { label: 'Envoyer le devis', niveau: 'normal' }

  // P2 — proxy date_creation pour "depuis émission"
  if (d.statut_commercial === 'devis_envoye' && depuisCreation > 7)
    return { label: 'Relancer le client', niveau: 'attention' }

  // P3
  if (d.statut_commercial === 'confirme' && (d.score_completude || 0) < 80)
    return { label: 'Compléter la préparation', niveau: 'attention' }

  // P4
  if (jj !== null && jj <= 30 && (!d.acompte_recu || d.acompte_recu === 0) && d.statut_commercial === 'confirme')
    return { label: "Relancer l'acompte", niveau: 'urgent' }

  // P5
  if (jj !== null && jj <= 30 && (!d.solde_recu || d.solde_recu === 0) && d.acompte_recu > 0)
    return { label: 'Relancer le solde', niveau: 'attention' }

  // P6
  if (jj !== null && jj <= 7 && !d.conducteur_ok)
    return { label: 'Valider le conducteur de soirée', niveau: 'urgent' }

  // P7
  if (jj !== null && jj <= 2 && (d.score_completude || 0) < 100)
    return { label: 'Finaliser la préparation — Jour J proche', niveau: 'urgent' }

  // P8
  if (d.statut_commercial === 'solde_recu')
    return { label: 'Prestation soldée — demander un avis client', niveau: 'positif' }

  // P9
  if (d.statut_commercial === 'archive' || d.statut_commercial === 'perdu')
    return { label: 'Dossier clôturé — aucune action requise', niveau: 'neutre' }

  return { label: "Dossier en cours — vérifier l'état", niveau: 'neutre' }
}

/** Vrai si le dossier déclenche les priorités urgentes P4, P6 ou P7 */
export function isUrgent(dossier) {
  const d = dossier
  const jj = d.date_evenement ? diffDays(d.date_evenement) : null
  const p4 = jj !== null && jj <= 30 && (!d.acompte_recu || d.acompte_recu === 0) && d.statut_commercial === 'confirme'
  const p6 = jj !== null && jj <= 7 && !d.conducteur_ok
  const p7 = jj !== null && jj <= 2 && (d.score_completude || 0) < 100
  return p4 || p6 || p7
}
