// ASSISTANT MÉTIER CENTRAL — règle 37 — LECTURE PURE
// Ce module ne modifie jamais dma_dossiers (R4)
// Pas de localStorage.setItem autorisé ici

import { getNextAction, isUrgent } from '../utils/getNextAction'
import { formatDate, formatMontant } from '../utils/dateUtils'
import { LABEL_STATUT_COMMERCIAL, LABEL_TYPE_EVENEMENT, STATUTS_CLOS, STATUTS_CA_YTD } from '../data/referentiel'
import { diffDays } from '../utils/dateUtils'
import BackupButton from '../components/BackupButton'

const MODULES_LINKS = [
  { id: 'configurateur', label: 'Configurateur' },
  { id: 'suivi',         label: 'Suivi commercial' },
  { id: 'preparateur',   label: 'Préparateur' },
  { id: 'dashboard',     label: 'Dashboard KPI' },
  { id: 'fiche_client',  label: 'Fiche client' },
  { id: 'checklist',     label: 'Checklist Jour J' },
  { id: 'conducteur',    label: 'Conducteur' },
]

export default function Assistant({ dossiers, onNavigate }) {
  // ── Indicateurs §4 ──
  const actifs = dossiers.filter((d) => !STATUTS_CLOS.includes(d.statut_commercial))
  const today = new Date(); today.setHours(0,0,0,0)
  const in30 = new Date(today); in30.setDate(in30.getDate()+30)

  const evtsProches = dossiers.filter((d) => {
    if (!d.date_evenement) return false
    const ev = new Date(d.date_evenement)
    return ev >= today && ev <= in30
  })

  const acomptesAttente = dossiers.filter(
    (d) => d.acompte_attendu > 0 && (!d.acompte_recu || d.acompte_recu === 0) && d.statut_commercial !== 'perdu'
  )

  const soldesAttente = dossiers.filter(
    (d) => d.solde_attendu > 0 && (!d.solde_recu || d.solde_recu === 0) && d.statut_commercial === 'acompte_recu'
  )

  const urgents = dossiers.filter(isUrgent)

  const caYtd = dossiers
    .filter((d) => STATUTS_CA_YTD.includes(d.statut_commercial))
    .reduce((sum, d) => sum + (d.total || 0), 0)

  // ── Dossiers actifs avec recommandation ──
  const actifsTries = [...actifs].sort((a, b) => {
    const jja = a.date_evenement ? diffDays(a.date_evenement) : 9999
    const jjb = b.date_evenement ? diffDays(b.date_evenement) : 9999
    return jja - jjb
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

      <div className="page-content">
        {/* KPI §4 */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Dossiers actifs</div>
            <div className="kpi-value">{actifs.length}</div>
          </div>
          <div className={`kpi-card ${evtsProches.length > 0 ? 'attention' : ''}`}>
            <div className="kpi-label">Evts ≤ 30j</div>
            <div className="kpi-value">{evtsProches.length}</div>
          </div>
          <div className={`kpi-card ${acomptesAttente.length > 0 ? 'attention' : ''}`}>
            <div className="kpi-label">Acomptes att.</div>
            <div className="kpi-value">{acomptesAttente.length}</div>
          </div>
          <div className={`kpi-card ${soldesAttente.length > 0 ? 'attention' : ''}`}>
            <div className="kpi-label">Soldes att.</div>
            <div className="kpi-value">{soldesAttente.length}</div>
          </div>
          <div className={`kpi-card ${urgents.length > 0 ? 'urgent' : ''}`}>
            <div className="kpi-label">URGENT</div>
            <div className="kpi-value">{urgents.length}</div>
          </div>
          <div className="kpi-card positif">
            <div className="kpi-label">CA YTD confirmé</div>
            <div className="kpi-value" style={{fontSize:16}}>{formatMontant(caYtd)}</div>
          </div>
        </div>

        {/* Navigation modules §5 */}
        <div className="card">
          <div className="card-title">Accès rapide aux modules</div>
          <div className="btn-group">
            {MODULES_LINKS.map((m) => (
              <button key={m.id} className="btn btn-secondary btn-sm" onClick={() => onNavigate(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommandations par dossier */}
        <div className="card">
          <div className="card-title">Actions recommandées</div>
          {actifsTries.length === 0 ? (
            <div className="empty-state">
              <p>Aucun dossier actif.</p>
              <button className="btn btn-primary" onClick={() => onNavigate('configurateur')}>
                Créer un premier dossier
              </button>
            </div>
          ) : (
            <table className="dossier-table">
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
                      <td><span className="dossier-id">{d.id_dossier}</span></td>
                      <td><span className="dossier-name">{d.nom_client}</span></td>
                      <td>{LABEL_TYPE_EVENEMENT[d.type_evenement] || d.type_evenement}</td>
                      <td>
                        {formatDate(d.date_evenement)}
                        {jj !== null && <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:4}}>
                          ({jj >= 0 ? `J-${jj}` : `J+${-jj}`})
                        </span>}
                      </td>
                      <td>
                        {d.statut_commercial
                          ? <span className={`pill pill-${d.statut_commercial}`}>{LABEL_STATUT_COMMERCIAL[d.statut_commercial]}</span>
                          : <span style={{color:'var(--urgent)',fontSize:12}}>Statut non reconnu — vérifier le dossier</span>
                        }
                      </td>
                      <td>
                        <span className={`badge badge-${action.niveau}`}>{action.label}</span>
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('fiche_client', d.id_dossier)}>
                          Voir
                        </button>
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
            Dernière modif : {dossiers.map(d=>d._meta?.derniere_modification).filter(Boolean).sort().reverse()[0] || '—'}
          </div>
        )}
      </div>
    </div>
  )
}
