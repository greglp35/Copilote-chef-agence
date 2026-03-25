// Bouton backup JSON — présent dans chaque module (règle 38 §7, priorité Haute)
// Exporte dma_dossiers en fichier JSON téléchargeable

import { todayISOString } from '../utils/dateUtils'

export default function BackupButton({ dossiers }) {
  function handleBackup() {
    const json = JSON.stringify(dossiers, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dma_dossiers_backup_${todayISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button className="btn btn-secondary btn-sm" onClick={handleBackup} title="Exporter dma_dossiers en JSON">
      Backup JSON
    </button>
  )
}
