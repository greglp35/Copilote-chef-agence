// CHECKLIST JOUR J
// Données stockées dans localStorage['dma_checklist_<id_dossier>'] — indépendant de dma_dossiers
// Ne touche pas dma_dossiers

import { useState, useEffect } from 'react'
import { LABEL_TYPE_EVENEMENT } from '../data/referentiel'
import { formatDate, diffDays } from '../utils/dateUtils'
import DossierSelect from '../components/DossierSelect'
import BackupButton from '../components/BackupButton'

const DEFAULT_ITEMS = [
  'Matériel vérifié et chargé dans le véhicule',
  'Adresse et accès confirmés (parking, monte-charge...)',
  'Contact client confirmé (J-1)',
  'Playlist et enchaînements validés avec le client',
  'Timing de la soirée finalisé',
  'Conducteur de soirée imprimé / chargé sur téléphone',
  'Équipe / techniciens / extras confirmés',
  'Règlement solde confirmé ou encaissé',
  'Heure d\'arrivée / installation planifiée',
  'Matériel de backup vérifié (enceinte secours, câbles...)',
]

function loadChecklist(id) {
  try {
    const raw = localStorage.getItem(`dma_checklist_${id}`)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore */ }
  return {}
}

function saveChecklist(id, state) {
  localStorage.setItem(`dma_checklist_${id}`, JSON.stringify(state))
}

export default function Checklist({ dossiers, selectedId, onNavigate }) {
  const [currentId, setCurrentId] = useState(selectedId || null)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    if (selectedId) setCurrentId(selectedId)
  }, [selectedId])

  useEffect(() => {
    if (currentId) setChecked(loadChecklist(currentId))
  }, [currentId])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)
  const jj = dossier?.date_evenement ? diffDays(dossier.date_evenement) : null
  const done = DEFAULT_ITEMS.filter((_, i) => checked[i]).length
  const pct = Math.round((done / DEFAULT_ITEMS.length) * 100)

  function toggle(idx) {
    setChecked((prev) => {
      const next = { ...prev, [idx]: !prev[idx] }
      if (currentId) saveChecklist(currentId, next)
      return next
    })
  }

  function resetAll() {
    if (!currentId) return
    setChecked({})
    saveChecklist(currentId, {})
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Checklist Jour J</div>
          <div className="page-subtitle">Validation terrain — données locales par dossier</div>
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

      <div className="page-content">
        {!dossier ? (
          <div className="empty-state"><p>Sélectionner un dossier confirmé pour accéder à la checklist.</p></div>
        ) : (
          <>
            {/* Info event */}
            <div className="card" style={{display:'flex',gap:24,flexWrap:'wrap',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:600,fontSize:15}}>{dossier.nom_client}</div>
                <div style={{fontSize:13,color:'var(--text-muted)'}}>
                  {LABEL_TYPE_EVENEMENT[dossier.type_evenement]||dossier.type_evenement} · {formatDate(dossier.date_evenement)}
                  {jj !== null && (
                    <span style={{marginLeft:8,fontWeight:600,color: jj<=2?'var(--urgent)':jj<=7?'var(--attention)':'var(--text-muted)'}}>
                      ({jj>=0?`J-${jj}`:jj===0?'Aujourd\'hui':`J+${-jj}`})
                    </span>
                  )}
                </div>
                {dossier.contact_jour_j && <div style={{fontSize:13,marginTop:4}}>Contact : {dossier.contact_jour_j}</div>}
              </div>
              <div style={{marginLeft:'auto',textAlign:'right'}}>
                <div style={{fontSize:22,fontWeight:700,color: pct===100?'var(--positif)':pct>=50?'var(--attention)':'var(--urgent)'}}>{pct}%</div>
                <div style={{fontSize:12,color:'var(--text-muted)'}}>{done}/{DEFAULT_ITEMS.length} points</div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="progress-bar" style={{marginBottom:16}}>
              <div className="progress-fill" style={{
                width:`${pct}%`,
                background: pct===100?'var(--positif)':pct>=50?'var(--attention)':'var(--urgent)'
              }} />
            </div>

            {/* Checklist */}
            <div className="card">
              <div className="card-title">
                Points de contrôle
                <button className="btn btn-secondary btn-sm" style={{marginLeft:8}} onClick={resetAll}>Réinitialiser</button>
              </div>
              {DEFAULT_ITEMS.map((item, idx) => (
                <div key={idx} className={`checklist-item${checked[idx]?' done':''}`}>
                  <input
                    type="checkbox"
                    id={`check-${idx}`}
                    checked={!!checked[idx]}
                    onChange={() => toggle(idx)}
                  />
                  <label htmlFor={`check-${idx}`}>{item}</label>
                </div>
              ))}
            </div>

            {pct === 100 && (
              <div className="card" style={{background:'var(--positif-bg)',borderLeft:'3px solid var(--positif)'}}>
                <strong>Checklist complète — prêt pour le Jour J !</strong>
                <div className="btn-group" style={{marginTop:10}}>
                  <button className="btn btn-primary btn-sm" onClick={()=>onNavigate('conducteur',currentId)}>Ouvrir le conducteur</button>
                </div>
              </div>
            )}

            <div style={{marginTop:12,display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary btn-sm" onClick={()=>onNavigate('preparateur',currentId)}>Retour préparateur</button>
              <button className="btn btn-secondary btn-sm" onClick={()=>onNavigate('conducteur',currentId)}>Conducteur</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
