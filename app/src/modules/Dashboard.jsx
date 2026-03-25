// DASHBOARD KPI — règle 27 — Lecture + agrégation uniquement
// Ne recalcule pas les données sources — agrège uniquement

import { getNextAction, isUrgent } from '../utils/getNextAction'
import { formatDate, formatMontant, diffDays } from '../utils/dateUtils'
import { LABEL_STATUT_COMMERCIAL, LABEL_TYPE_EVENEMENT, STATUTS_CLOS, STATUTS_CA_YTD } from '../data/referentiel'
import BackupButton from '../components/BackupButton'

export default function Dashboard({ dossiers, onNavigate }) {
  const today = new Date(); today.setHours(0,0,0,0)
  const in30 = new Date(today); in30.setDate(in30.getDate()+30)

  const actifs   = dossiers.filter((d) => !STATUTS_CLOS.includes(d.statut_commercial))
  const urgents  = dossiers.filter(isUrgent)
  const caYtd    = dossiers.filter((d) => STATUTS_CA_YTD.includes(d.statut_commercial)).reduce((s,d)=>s+(d.total||0),0)
  const acomptes = dossiers.filter((d)=>d.acompte_attendu>0&&(!d.acompte_recu||d.acompte_recu===0)&&d.statut_commercial!=='perdu').reduce((s,d)=>s+(d.acompte_attendu||0),0)
  const soldes   = dossiers.filter((d)=>d.solde_attendu>0&&(!d.solde_recu||d.solde_recu===0)&&d.statut_commercial==='acompte_recu').reduce((s,d)=>s+(d.solde_attendu||0),0)
  const evtsProches = dossiers.filter((d)=>{
    if(!d.date_evenement) return false
    const ev = new Date(d.date_evenement)
    return ev>=today && ev<=in30
  })

  const parStatut = {}
  dossiers.forEach((d)=>{
    parStatut[d.statut_commercial] = (parStatut[d.statut_commercial]||0)+1
  })

  const tousTriés = [...dossiers]
    .filter((d)=>!STATUTS_CLOS.includes(d.statut_commercial))
    .sort((a,b)=>{
      const ja = a.date_evenement ? diffDays(a.date_evenement) : 9999
      const jb = b.date_evenement ? diffDays(b.date_evenement) : 9999
      return ja - jb
    })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard KPI</div>
          <div className="page-subtitle">Vue globale activité — agrégation lecture seule</div>
        </div>
        <BackupButton dossiers={dossiers} />
      </div>

      <div className="page-content">
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total dossiers</div>
            <div className="kpi-value">{dossiers.length}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Dossiers actifs</div>
            <div className="kpi-value">{actifs.length}</div>
          </div>
          <div className={`kpi-card ${urgents.length>0?'urgent':''}`}>
            <div className="kpi-label">URGENT</div>
            <div className="kpi-value">{urgents.length}</div>
          </div>
          <div className={`kpi-card ${evtsProches.length>0?'attention':''}`}>
            <div className="kpi-label">Evts ≤ 30j</div>
            <div className="kpi-value">{evtsProches.length}</div>
          </div>
          <div className="kpi-card positif">
            <div className="kpi-label">CA YTD confirmé</div>
            <div className="kpi-value" style={{fontSize:16}}>{formatMontant(caYtd)}</div>
          </div>
          <div className={`kpi-card ${acomptes>0?'attention':''}`}>
            <div className="kpi-label">Acomptes à recevoir</div>
            <div className="kpi-value" style={{fontSize:16}}>{formatMontant(acomptes)}</div>
          </div>
          <div className={`kpi-card ${soldes>0?'attention':''}`}>
            <div className="kpi-label">Soldes à recevoir</div>
            <div className="kpi-value" style={{fontSize:16}}>{formatMontant(soldes)}</div>
          </div>
        </div>

        {/* Répartition par statut */}
        <div className="card">
          <div className="card-title">Répartition par statut commercial</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {Object.entries(parStatut).map(([s,n])=>(
              <span key={s} className={`pill pill-${s}`} style={{fontSize:12}}>
                {LABEL_STATUT_COMMERCIAL[s]||s} : {n}
              </span>
            ))}
          </div>
        </div>

        {/* Dossiers actifs avec action */}
        <div className="card">
          <div className="card-title">Dossiers actifs — actions en cours</div>
          {tousTriés.length === 0
            ? <div className="empty-state"><p>Aucun dossier actif.</p></div>
            : (
              <table className="dossier-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Evénement</th>
                    <th>Total</th>
                    <th>Acompte reçu</th>
                    <th>Statut</th>
                    <th>Prochaine action</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tousTriés.map((d)=>{
                    const action = getNextAction(d)
                    const jj = d.date_evenement ? diffDays(d.date_evenement) : null
                    return (
                      <tr key={d.id_dossier}>
                        <td><span className="dossier-id">{d.id_dossier}</span></td>
                        <td><span className="dossier-name">{d.nom_client}</span></td>
                        <td>{LABEL_TYPE_EVENEMENT[d.type_evenement]||d.type_evenement}</td>
                        <td>
                          {formatDate(d.date_evenement)}
                          {jj!==null && <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:4}}>
                            ({jj>=0?`J-${jj}`:`J+${-jj}`})
                          </span>}
                        </td>
                        <td>{formatMontant(d.total)}</td>
                        <td>{formatMontant(d.acompte_recu)}</td>
                        <td><span className={`pill pill-${d.statut_commercial}`}>{LABEL_STATUT_COMMERCIAL[d.statut_commercial]||d.statut_commercial}</span></td>
                        <td><span className={`badge badge-${action.niveau}`}>{action.label}</span></td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={()=>onNavigate('fiche_client',d.id_dossier)}>Voir</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  )
}
