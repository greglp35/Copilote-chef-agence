// lib/format.js — Formatage d'affichage

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

export function formatMontant(n) {
  if (n === undefined || n === null || n === '') return '—'
  return Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
