import { LABEL_TYPE_EVENEMENT, LABEL_STATUT_COMMERCIAL } from '../data/referentiel'
import { formatDate } from '../lib/format'

export default function DossierSelect({ dossiers, selectedId, onChange, filter, label = 'Dossier' }) {
  const list = filter ? dossiers.filter(filter) : dossiers

  return (
    <div className="selector-bar">
      <label>{label} :</label>
      <select value={selectedId || ''} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">— Sélectionner —</option>
        {list.map((d) => (
          <option key={d.id_dossier} value={d.id_dossier}>
            {d.id_dossier} · {d.nom_client} · {LABEL_TYPE_EVENEMENT[d.type_evenement] || d.type_evenement} · {formatDate(d.date_evenement)} · {LABEL_STATUT_COMMERCIAL[d.statut_commercial] || d.statut_commercial}
          </option>
        ))}
      </select>
    </div>
  )
}
