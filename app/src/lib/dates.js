// lib/dates.js — Utilitaires de dates
// Pas de dépendances externes

/** Jours entre aujourd'hui et une date ISO. Positif = futur, négatif = passé. */
export function diffDays(dateStr) {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const today = new Date()
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return Math.round((target - today) / 86400000)
}

/** Jours écoulés depuis une date ISO (positif = passé). */
export function daysSince(dateStr) {
  if (!dateStr) return 0
  const d = diffDays(dateStr)
  return d === null ? 0 : -d
}

/** Date d'aujourd'hui au format ISO YYYY-MM-DD */
export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
