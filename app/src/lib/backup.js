// lib/backup.js — Export JSON des dossiers
// Lecture seule — ne modifie jamais dma_dossiers

import { todayISO } from './dates'

/**
 * Déclenche le téléchargement d'un fichier JSON contenant tous les dossiers.
 * @param {Array} dossiers — tableau lu depuis dma_dossiers
 */
export function exportBackupJSON(dossiers) {
  const payload = {
    version: '1.1',
    exported_at: new Date().toISOString(),
    source: 'dma_dossiers',
    count: dossiers.length,
    dossiers,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dma_dossiers_backup_${todayISO()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
