// ASSISTANT MÉTIER CENTRAL — règle 37
// Lecture pure — aucun localStorage.setItem autorisé (R4)

import { getNextAction, isUrgent } from '../../lib/rules'
import { diffDays } from '../../lib/dates'
import { formatDate, formatMontant } from '../../lib/format'
import { LABEL_STATUT_COMMERCIAL, LABEL_TYPE_EVENEMENT, STATUTS_CLOS, STATUTS_CA_YTD } from '../../data/referentiel'
import BackupButton from '../../components/BackupButton'

const MODULES_LINKS = [
  { id: 'configurateur', label: 'Configurateur' },
  { id: 'suivi',         label: 'Suivi commercial' },
  { id: 'preparateur',   label: 'Préparateur' },
  { id: 'dashboard',     label: 'Dashboard KPI' },
  { id: 'fiche-client',  label: 'Fiche client' },
  { id: 'checklist',     label: 'Checklist Jour J' },
  { id: 'conducteur',    label: 'Conducteur' },
]

export default function Assistant({ dossiers, onNavigate }) {
  const today = new Date(); today.setHours(0,0,0,0)
  const in30  = new Date(today); in30.setDate(in30.getDate() + 30)

  const actifs        = dossiers.filter((d) => !STATUTS_CLOS.includes(d.statut_commercial))
  const urgents       = dossiers.filter(isUrgent)
  const evtsProches   = dossiers.filter((d) => { if (!d.date_evenement) return false; const ev = new Date(d.date_evenement); return ev >= today && ev <= in30 })
  const acomptesAtt   = dossiers.filter((d) => d.acompte_attendu > 0 && (!d.acompte_recu || d.acompte_recu === 0) && d.statut_commercial !== 'perdu')
  const soldesAtt     = dossiers.filter((d) => d.solde_attendu > 0 && (!d.solde_recu || d.solde_recu === 0) && d.statut_commercial === 'acompte_recu')
  const caYtd         = dossiers.filter((d) => STATUTS_CA_YTD.includes(d.statut_commercial)).reduce((s, d) => s + (d.total || 0), 0)

  const actifsTries = [...actifs].sort((a, b) => {
    const ja = a.date_evenement ? diffDays(a.date_evenement) : 9999
    const jb = b.date_evenement ? diffDays(b.date_evenement) : 9999
    return ja - jb
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Assistant Métier Central</div>
          <div className="page-subtitle">Hub de recommandation — lecture seule</div>
        </div>
        <BackupButton dossiers={dossiers} />
      </div>

      <div className="page-body">
        {/* KPIs §4 */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Dossiers actifs</div>
            <div className="kpi-value">{actifs.length}</div>
          </div>
          <div className={`kpi-card ${evtsProches.length > 0 ? 'is-attention' : ''}`}>
            <div className="kpi-label">Evts ≤ 30j</div>
            <div className="kpi-value">{evtsProches.length}</div>
          </div>
          <div className={`kpi-card ${acomptesAtt.length > 0 ? 'is-attention' : ''}`}>
            <div className="kpi-label">Acomptes att.</div>
            <div className="kpi-value">{acomptesAtt.length}</div>
          </div>
          <div className={`kpi-card ${soldesAtt.length > 0 ? 'is-attention' : ''}`}>
            <div className="kpi-label">Soldes att.</div>
            <div className="kpi-value">{soldesAtt.length}</div>
          </div>
          <div className={`kpi-card ${urgents.length > 0 ? 'is-urgent' : ''}`}>
            <div className="kpi-label">URGENT</div>
            <div className="kpi-value">{urgents.length}</div>
          </div>
          <div className="kpi-card is-positif is-small">
            <div className="kpi-label">CA YTD</div>
            <div className="kpi-value">{formatMontant(caYtd)}</div>
          </div>
        </div>

        {/* Navigation §5 */}
        <div className="card">
          <div className="card-title">Accès rapide aux modules</div>
          <div className="btn-row">
            {MODULES_LINKS.map((m) => (
              <button key={m.id} className="btn btn-secondary btn-sm" onClick={() => onNavigate(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions recommandées */}
        <div className="card">
          <div className="card-title">Actions recommandées — dossiers actifs</div>
          {actifsTries.length === 0 ? (
            <div className="empty">
              <p>Aucun dossier actif.</p>
              <button className="btn btn-primary" onClick={() => onNavigate('configurateur')}>
                Créer un premier dossier
              </button>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Dossier</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Evénement</th>
                  <th>Statut</th>
                  <th>Action recommandée</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {actifsTries.map((d) => {
                  const action = getNextAction(d)
                  const jj = d.date_evenement ? diffDays(d.date_evenement) : null
                  return (
                    <tr key={d.id_dossier}>
                      <td><span className="mono">{d.id_dossier}</span></td>
                      <td><span className="bold">{d.nom_client}</span></td>
                      <td>{LABEL_TYPE_EVENEMENT[d.type_evenement] || d.type_evenement}</td>
                      <td>
                        {formatDate(d.date_evenement)}
                        {jj !== null && <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:4}}>({jj >= 0 ? `J-${jj}` : `J+${-jj}`})</span>}
                      </td>
                      <td>
                        {d.statut_commercial
                          ? <span className={`pill pill-${d.statut_commercial}`}>{LABEL_STATUT_COMMERCIAL[d.statut_commercial]}</span>
                          : <span style={{color:'var(--urgent)',fontSize:12}}>Statut non reconnu — vérifier le dossier</span>
                        }
                      </td>
                      <td><span className={`badge badge-${action.niveau}`}>{action.label}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('fiche-client', d.id_dossier)}>Voir</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {dossiers.length > 0 && (
          <div style={{fontSize:11,color:'var(--text-muted)',textAlign:'right'}}>
            Fraîcheur : {dossiers.map(d => d._meta?.derniere_modification).filter(Boolean).sort().reverse()[0] || '—'}
          </div>
        )}
      </div>
    </div>
  )
}
