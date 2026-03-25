// Retourne le nombre de jours entre aujourd'hui et une date ISO
// Positif = dans le futur, négatif = dans le passé
export function diffDays(dateStr) {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const today = new Date()
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

// Nombre de jours écoulés depuis une date ISO (positif = passé)
export function daysSince(dateStr) {
  if (!dateStr) return 0
  const d = diffDays(dateStr)
  return d === null ? 0 : -d
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

export function formatMontant(n) {
  if (n === undefined || n === null || n === '') return '—'
  return Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export function todayISOString() {
  return new Date().toISOString().slice(0, 10)
}
