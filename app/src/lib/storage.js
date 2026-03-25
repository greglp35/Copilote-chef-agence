// lib/storage.js — Accès localStorage pur (sans React)
// Clé figée : règle 38 §3 point 7 — ne jamais utiliser de variante

import { todayISO } from './dates'

const LS_KEY = 'dma_dossiers'

/** Lit dma_dossiers depuis localStorage. Retourne null si absent/invalide. */
export function readDossiers() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null
  } catch (e) {
    console.error('[DMA] Erreur lecture dma_dossiers :', e)
    return null
  }
}

/** Écrit l'array complet dans localStorage. */
export function writeDossiers(dossiers) {
  localStorage.setItem(LS_KEY, JSON.stringify(dossiers))
}

/** Upsert : remplace si id_dossier existe, ajoute sinon. */
export function upsertDossier(dossiers, dossier) {
  const idx = dossiers.findIndex((d) => d.id_dossier === dossier.id_dossier)
  if (idx === -1) return [...dossiers, dossier]
  return dossiers.map((d, i) => i === idx ? dossier : d)
}

/** Applique un patch partiel sur un dossier (met à jour _meta.derniere_modification). */
export function patchDossier(dossiers, id, patch) {
  return dossiers.map((d) => {
    if (d.id_dossier !== id) return d
    return { ...d, ...patch, _meta: { ...d._meta, derniere_modification: todayISO() } }
  })
}

/** Génère le prochain id_dossier DJ-YYYY-NNN — USAGE EXCLUSIF du Configurateur. */
export function generateIdDossier(dossiers) {
  const year = new Date().getFullYear()
  const prefix = `DJ-${year}-`
  const max = dossiers
    .filter((d) => d.id_dossier?.startsWith(prefix))
    .reduce((m, d) => {
      const n = parseInt(d.id_dossier.replace(prefix, ''), 10)
      return isNaN(n) ? m : Math.max(m, n)
    }, 0)
  return `${prefix}${String(max + 1).padStart(3, '0')}`
}

/** Génère le prochain ref_devis DEV-YYYY-NNN — USAGE EXCLUSIF du Configurateur. */
export function generateRefDevis(dossiers) {
  const year = new Date().getFullYear()
  const prefix = `DEV-${year}-`
  const max = dossiers
    .filter((d) => d.ref_devis?.startsWith(prefix))
    .reduce((m, d) => {
      const n = parseInt(d.ref_devis.replace(prefix, ''), 10)
      return isNaN(n) ? m : Math.max(m, n)
    }, 0)
  return `${prefix}${String(max + 1).padStart(3, '0')}`
}
