import { exportBackupJSON } from '../lib/backup'

export default function BackupButton({ dossiers }) {
  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={() => exportBackupJSON(dossiers)}
      title="Exporter dma_dossiers en JSON"
    >
      Backup JSON
    </button>
  )
}
