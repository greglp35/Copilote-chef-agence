// CONDUCTEUR DE SOIRÉE INTERACTIF
// Propriétaire de conducteur_ok (via préparateur) — données locales : dma_conducteur_<id>

import { useState, useEffect } from 'react'
import { LABEL_TYPE_EVENEMENT } from '../../data/referentiel'
import { formatDate } from '../../lib/format'
import { diffDays } from '../../lib/dates'
import DossierSelect from '../../components/DossierSelect'
import BackupButton from '../../components/BackupButton'

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

function load(id)       { try { return JSON.parse(localStorage.getItem(`dma_conducteur_${id}`)) || null } catch { return null } }
function save(id, steps){ localStorage.setItem(`dma_conducteur_${id}`, JSON.stringify(steps)) }
function fresh()        { return DEFAULT_STEPS.map((s) => ({ ...s, statut: 'pending' })) }

export default function Conducteur({ dossiers, selectedId, onNavigate }) {
  const [currentId, setCurrentId] = useState(selectedId || null)
  const [steps, setSteps]         = useState([])
  const [editIdx, setEditIdx]     = useState(null)
  const [editForm, setEditForm]   = useState({})

  useEffect(() => { if (selectedId) setCurrentId(selectedId) }, [selectedId])
  useEffect(() => { if (currentId) setSteps(load(currentId) || fresh()) }, [currentId])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)
  const jj      = dossier?.date_evenement ? diffDays(dossier.date_evenement) : null
  const done    = steps.filter((s) => s.statut === 'done').length
  const pct     = steps.length ? Math.round((done / steps.length) * 100) : 0

  function setStatut(idx, statut) {
    setSteps((prev) => { const n = prev.map((s,i) => i===idx ? {...s,statut} : s); if(currentId) save(currentId,n); return n })
  }

  function startEdit(idx) { setEditIdx(idx); setEditForm({ heure: steps[idx].heure, label: steps[idx].label }) }

  function saveEdit(idx) {
    setSteps((prev) => { const n = prev.map((s,i) => i===idx ? {...s,...editForm} : s); if(currentId) save(currentId,n); return n })
    setEditIdx(null)
  }

  function addStep() {
    setSteps((prev) => { const n = [...prev, { heure:'', label:'Nouvelle étape', statut:'pending' }]; if(currentId) save(currentId,n); return n })
  }

  function removeStep(idx) {
    setSteps((prev) => { const n = prev.filter((_,i) => i!==idx); if(currentId) save(currentId,n); return n })
  }

  function resetAll() {
    const f = fresh(); setSteps(f); if(currentId) save(currentId, f)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Conducteur de soirée</div>
          <div className="page-subtitle">Déroulé en temps réel — stockage local par dossier</div>
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
                    <strong style={{marginLeft:8,color:jj===0?'var(--urgent)':jj<=2?'var(--urgent)':jj<=7?'var(--attention)':'var(--text-muted)'}}>
                      ({jj===0?"AUJOURD'HUI":jj>0?`J-${jj}`:`J+${-jj}`})
                    </strong>
                  )}
                </div>
                {dossier.contact_jour_j && <div style={{fontSize:13,marginTop:4}}>Contact : {dossier.contact_jour_j}</div>}
              </div>
              <div style={{marginLeft:'auto',textAlign:'right'}}>
                <div style={{fontSize:26,fontWeight:700,color:pct===100?'var(--positif)':'var(--normal)'}}>{pct}%</div>
                <div style={{fontSize:12,color:'var(--text-muted)'}}>{done}/{steps.length} étapes</div>
              </div>
            </div>

            <div className="progress-track" style={{marginBottom:16}}>
              <div className="progress-fill fill-positif" style={{width:`${pct}%`}} />
            </div>

            <div className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <div className="card-title" style={{margin:0}}>Déroulé de soirée</div>
                <div className="btn-row">
                  <button className="btn btn-secondary btn-sm" onClick={addStep}>+ Étape</button>
                  <button className="btn btn-secondary btn-sm" onClick={resetAll}>Réinitialiser</button>
                </div>
              </div>

              {steps.map((step, idx) => (
                <div key={idx} className={`tl-item${step.statut==='done'?' done':''}`}>
                  <div className={`tl-dot ${step.statut}`} />
                  <div className="tl-body">
                    {editIdx === idx ? (
                      <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                        <input type="time" value={editForm.heure} onChange={(e)=>setEditForm(f=>({...f,heure:e.target.value}))}
                          style={{width:90,padding:'4px 6px',border:'1px solid var(--border)',borderRadius:4}} />
                        <input type="text" value={editForm.label} onChange={(e)=>setEditForm(f=>({...f,label:e.target.value}))}
                          style={{flex:1,padding:'4px 6px',border:'1px solid var(--border)',borderRadius:4}} />
                        <button className="btn btn-primary btn-sm" onClick={()=>saveEdit(idx)}>OK</button>
                        <button className="btn btn-secondary btn-sm" onClick={()=>setEditIdx(null)}>Annuler</button>
                      </div>
                    ) : (
                      <>
                        <div className="tl-time">{step.heure || '—'}</div>
                        <div className="tl-label">{step.label}</div>
                      </>
                    )}
                  </div>
                  {editIdx !== idx && (
                    <div className="tl-actions">
                      {step.statut !== 'done'    && <button className="btn btn-secondary btn-sm" style={{color:'var(--positif)'}} onClick={()=>setStatut(idx,'done')}>Fait</button>}
                      {step.statut === 'pending' && <button className="btn btn-secondary btn-sm" style={{color:'var(--normal)'}}  onClick={()=>setStatut(idx,'active')}>En cours</button>}
                      {step.statut !== 'pending' && <button className="btn btn-secondary btn-sm" onClick={()=>setStatut(idx,'pending')}>Reset</button>}
                      <button className="btn btn-secondary btn-sm" onClick={()=>startEdit(idx)}>Edit</button>
                      <button className="btn btn-secondary btn-sm" style={{color:'var(--urgent)'}} onClick={()=>removeStep(idx)}>×</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {pct === 100 && (
              <div className="card" style={{background:'var(--positif-bg)',borderLeft:'3px solid var(--positif)'}}>
                <strong>Soirée terminée — toutes les étapes validées !</strong>
                <div className="btn-row" style={{marginTop:10}}>
                  <button className="btn btn-primary btn-sm" onClick={() => onNavigate('suivi', currentId)}>Clôturer dans Suivi</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
