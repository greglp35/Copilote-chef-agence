// CONDUCTEUR DE SOIRÉE INTERACTIF
// Données stockées dans localStorage['dma_conducteur_<id_dossier>']
// Ne touche pas dma_dossiers

import { useState, useEffect } from 'react'
import { LABEL_TYPE_EVENEMENT } from '../data/referentiel'
import { formatDate, diffDays } from '../utils/dateUtils'
import DossierSelect from '../components/DossierSelect'
import BackupButton from '../components/BackupButton'

const DEFAULT_STEPS = [
  { heure: '17:00', label: 'Arrivée & installation technique' },
  { heure: '18:30', label: 'Soundcheck' },
  { heure: '19:00', label: 'Accueil des invités' },
  { heure: '19:30', label: 'Cocktail' },
  { heure: '20:00', label: 'Passage en salle — dîner' },
  { heure: '21:00', label: 'Discours / temps forts' },
  { heure: '22:00', label: 'Ouverture de la piste' },
  { heure: '23:00', label: 'Animation principale' },
  { heure: '00:30', label: 'Point mi-soirée (pause 15 min)' },
  { heure: '02:00', label: 'Clôture soirée — dernier morceau' },
  { heure: '02:30', label: 'Démontage et rangement' },
]

function loadSteps(id) {
  try {
    const raw = localStorage.getItem(`dma_conducteur_${id}`)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore */ }
  return DEFAULT_STEPS.map((s) => ({ ...s, statut: 'pending' }))
}

function saveSteps(id, steps) {
  localStorage.setItem(`dma_conducteur_${id}`, JSON.stringify(steps))
}

export default function Conducteur({ dossiers, selectedId, onNavigate }) {
  const [currentId, setCurrentId] = useState(selectedId || null)
  const [steps, setSteps] = useState([])
  const [editIdx, setEditIdx] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    if (selectedId) setCurrentId(selectedId)
  }, [selectedId])

  useEffect(() => {
    if (currentId) setSteps(loadSteps(currentId))
  }, [currentId])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)
  const jj = dossier?.date_evenement ? diffDays(dossier.date_evenement) : null

  function setStatut(idx, statut) {
    setSteps((prev) => {
      const next = prev.map((s, i) => i === idx ? { ...s, statut } : s)
      if (currentId) saveSteps(currentId, next)
      return next
    })
  }

  function startEdit(idx) {
    setEditIdx(idx)
    setEditForm({ heure: steps[idx].heure, label: steps[idx].label })
  }

  function saveEdit(idx) {
    setSteps((prev) => {
      const next = prev.map((s, i) => i === idx ? { ...s, heure: editForm.heure, label: editForm.label } : s)
      if (currentId) saveSteps(currentId, next)
      return next
    })
    setEditIdx(null)
  }

  function addStep() {
    setSteps((prev) => {
      const next = [...prev, { heure: '', label: 'Nouvelle étape', statut: 'pending' }]
      if (currentId) saveSteps(currentId, next)
      return next
    })
  }

  function removeStep(idx) {
    setSteps((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      if (currentId) saveSteps(currentId, next)
      return next
    })
  }

  function resetAll() {
    const fresh = DEFAULT_STEPS.map((s) => ({ ...s, statut: 'pending' }))
    setSteps(fresh)
    if (currentId) saveSteps(currentId, fresh)
  }

  const done = steps.filter((s) => s.statut === 'done').length
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Conducteur de soirée</div>
          <div className="page-subtitle">Déroulé en temps réel — données locales par dossier</div>
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
          <div className="empty-state"><p>Sélectionner un dossier confirmé pour ouvrir le conducteur.</p></div>
        ) : (
          <>
            {/* Header event */}
            <div className="card" style={{display:'flex',gap:24,flexWrap:'wrap',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:600,fontSize:15}}>{dossier.nom_client}</div>
                <div style={{fontSize:13,color:'var(--text-muted)'}}>
                  {LABEL_TYPE_EVENEMENT[dossier.type_evenement]||dossier.type_evenement} · {formatDate(dossier.date_evenement)}
                  {jj !== null && (
                    <span style={{marginLeft:8,fontWeight:600,color: jj===0?'var(--urgent)':jj<=2?'var(--urgent)':jj<=7?'var(--attention)':'var(--text-muted)'}}>
                      ({jj===0?'AUJOURD\'HUI':jj>0?`J-${jj}`:`J+${-jj}`})
                    </span>
                  )}
                </div>
                {dossier.contact_jour_j && <div style={{fontSize:13,marginTop:4}}>Contact : {dossier.contact_jour_j}</div>}
              </div>
              <div style={{marginLeft:'auto',textAlign:'right'}}>
                <div style={{fontSize:22,fontWeight:700,color: pct===100?'var(--positif)':'var(--normal)'}}>{pct}%</div>
                <div style={{fontSize:12,color:'var(--text-muted)'}}>{done}/{steps.length} étapes</div>
              </div>
            </div>

            {/* Barre progression */}
            <div className="progress-bar" style={{marginBottom:16}}>
              <div className="progress-fill" style={{width:`${pct}%`}} />
            </div>

            {/* Timeline */}
            <div className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <div className="card-title" style={{margin:0}}>Déroulé de soirée</div>
                <div className="btn-group">
                  <button className="btn btn-secondary btn-sm" onClick={addStep}>+ Étape</button>
                  <button className="btn btn-secondary btn-sm" onClick={resetAll}>Réinitialiser</button>
                </div>
              </div>

              {steps.map((step, idx) => (
                <div key={idx} className={`timeline-item${step.statut==='done'?' done':''}`}>
                  <div className={`timeline-dot ${step.statut}`} />
                  <div className="timeline-content">
                    {editIdx === idx ? (
                      <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                        <input
                          type="time"
                          value={editForm.heure}
                          onChange={(e)=>setEditForm(f=>({...f,heure:e.target.value}))}
                          style={{width:90,padding:'4px 6px',border:'1px solid var(--border)',borderRadius:4}}
                        />
                        <input
                          type="text"
                          value={editForm.label}
                          onChange={(e)=>setEditForm(f=>({...f,label:e.target.value}))}
                          style={{flex:1,padding:'4px 6px',border:'1px solid var(--border)',borderRadius:4}}
                        />
                        <button className="btn btn-primary btn-sm" onClick={()=>saveEdit(idx)}>OK</button>
                        <button className="btn btn-secondary btn-sm" onClick={()=>setEditIdx(null)}>Annuler</button>
                      </div>
                    ) : (
                      <>
                        <div className="timeline-time">{step.heure || '—'}</div>
                        <div className="timeline-label">{step.label}</div>
                      </>
                    )}
                  </div>
                  {editIdx !== idx && (
                    <div style={{display:'flex',gap:4,flexShrink:0}}>
                      {step.statut !== 'done' && (
                        <button className="btn btn-secondary btn-sm" onClick={()=>setStatut(idx,'done')} style={{color:'var(--positif)'}}>
                          Fait
                        </button>
                      )}
                      {step.statut !== 'active' && step.statut !== 'done' && (
                        <button className="btn btn-secondary btn-sm" onClick={()=>setStatut(idx,'active')} style={{color:'var(--normal)'}}>
                          En cours
                        </button>
                      )}
                      {step.statut !== 'pending' && (
                        <button className="btn btn-secondary btn-sm" onClick={()=>setStatut(idx,'pending')}>
                          Reset
                        </button>
                      )}
                      <button className="btn btn-secondary btn-sm" onClick={()=>startEdit(idx)}>Edit</button>
                      <button className="btn btn-secondary btn-sm" style={{color:'var(--urgent)'}} onClick={()=>removeStep(idx)}>×</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {pct === 100 && (
              <div className="card" style={{background:'var(--positif-bg)',borderLeft:'3px solid var(--positif)'}}>
                <strong>Soirée terminée — toutes les étapes sont validées !</strong>
                <div style={{marginTop:8}}>
                  <button className="btn btn-primary btn-sm" onClick={()=>onNavigate('suivi',currentId)}>
                    Clôturer le dossier dans le Suivi
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
