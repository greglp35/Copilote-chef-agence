// CHECKLIST JOUR J
// Données : localStorage['dma_checklist_<id_dossier>'] — indépendant de dma_dossiers

import { useState, useEffect } from 'react'
import { LABEL_TYPE_EVENEMENT } from '../../data/referentiel'
import { formatDate, formatMontant } from '../../lib/format'
import { diffDays } from '../../lib/dates'
import DossierSelect from '../../components/DossierSelect'
import BackupButton from '../../components/BackupButton'

const ITEMS = [
  'Matériel vérifié et chargé dans le véhicule',
  'Adresse et accès confirmés (parking, monte-charge...)',
  'Contact client confirmé (J-1)',
  'Playlist et enchaînements validés avec le client',
  'Timing de la soirée finalisé',
  "Conducteur de soirée imprimé / chargé sur téléphone",
  'Équipe / techniciens / extras confirmés',
  'Règlement solde confirmé ou encaissé',
  "Heure d'arrivée / installation planifiée",
  'Matériel de backup vérifié (enceinte secours, câbles...)',
]

function load(id)       { try { return JSON.parse(localStorage.getItem(`dma_checklist_${id}`)) || {} } catch { return {} } }
function save(id, state){ localStorage.setItem(`dma_checklist_${id}`, JSON.stringify(state)) }

export default function Checklist({ dossiers, selectedId, onNavigate }) {
  const [currentId, setCurrentId] = useState(selectedId || null)
  const [checked, setChecked]     = useState({})

  useEffect(() => { if (selectedId) setCurrentId(selectedId) }, [selectedId])
  useEffect(() => { if (currentId) setChecked(load(currentId)) }, [currentId])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)
  const jj      = dossier?.date_evenement ? diffDays(dossier.date_evenement) : null
  const done    = ITEMS.filter((_, i) => checked[i]).length
  const pct     = Math.round((done / ITEMS.length) * 100)
  const fillClass = pct === 100 ? 'fill-positif' : pct >= 50 ? 'fill-attention' : 'fill-urgent'

  function toggle(idx) {
    setChecked((prev) => {
      const next = { ...prev, [idx]: !prev[idx] }
      if (currentId) save(currentId, next)
      return next
    })
  }

  function reset() {
    setChecked({})
    if (currentId) save(currentId, {})
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Checklist Jour J</div>
          <div className="page-subtitle">Validation terrain — stockage local par dossier</div>
        </div>
        <BackupButton dossiers={dossiers} />
      </div>

      <DossierSelect
        dossiers={dossiers}
        selectedId={currentId}
        onChange={setCurrentId}
        label="Dossier"
        filter={(d) => ['confirme','acompte_recu','solde_recu'].includes(d.statut_commercial)}
      />

      <div className="page-body">
        {!dossier ? (
          <div className="empty"><p>Sélectionner un dossier confirmé.</p></div>
        ) : (
          <>
            <div className="card" style={{display:'flex',gap:24,flexWrap:'wrap',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:600,fontSize:15}}>{dossier.nom_client}</div>
                <div style={{fontSize:13,color:'var(--text-muted)'}}>
                  {LABEL_TYPE_EVENEMENT[dossier.type_evenement]||dossier.type_evenement} · {formatDate(dossier.date_evenement)}
                  {jj !== null && (
                    <strong style={{marginLeft:8,color:jj<=2?'var(--urgent)':jj<=7?'var(--attention)':'var(--text-muted)'}}>
                      ({jj===0?"Aujourd'hui":jj>0?`J-${jj}`:`J+${-jj}`})
                    </strong>
                  )}
                </div>
                {dossier.contact_jour_j && <div style={{fontSize:13,marginTop:4}}>Contact : {dossier.contact_jour_j}</div>}
                <div style={{fontSize:13,marginTop:2}}>Total : {formatMontant(dossier.total)}</div>
              </div>
              <div style={{marginLeft:'auto',textAlign:'right'}}>
                <div style={{fontSize:26,fontWeight:700,color:pct===100?'var(--positif)':pct>=50?'var(--attention)':'var(--urgent)'}}>{pct}%</div>
                <div style={{fontSize:12,color:'var(--text-muted)'}}>{done}/{ITEMS.length}</div>
              </div>
            </div>

            <div className="progress-track" style={{marginBottom:16}}>
              <div className={`progress-fill ${fillClass}`} style={{width:`${pct}%`}} />
            </div>

            <div className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <div className="card-title" style={{margin:0}}>Points de contrôle</div>
                <button className="btn btn-secondary btn-sm" onClick={reset}>Réinitialiser</button>
              </div>
              {ITEMS.map((item, idx) => (
                <div key={idx} className={`check-item${checked[idx]?' done':''}`}>
                  <input type="checkbox" id={`ci-${idx}`} checked={!!checked[idx]} onChange={() => toggle(idx)} />
                  <label htmlFor={`ci-${idx}`}>{item}</label>
                </div>
              ))}
            </div>

            {pct === 100 && (
              <div className="card" style={{background:'var(--positif-bg)',borderLeft:'3px solid var(--positif)'}}>
                <strong>Checklist complète — prêt pour le Jour J !</strong>
                <div className="btn-row" style={{marginTop:10}}>
                  <button className="btn btn-primary btn-sm" onClick={() => onNavigate('conducteur', currentId)}>Ouvrir le conducteur</button>
                </div>
              </div>
            )}

            <div className="btn-row" style={{justifyContent:'flex-end',marginTop:8}}>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('preparateur', currentId)}>Retour préparateur</button>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('conducteur', currentId)}>Conducteur</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
