// PRÉPARATEUR DE PRESTATION — règle 26
// Gère : score_completude, conducteur_ok, contact_jour_j, statut_evenement
// Ne touche pas : total, acompte_*, solde_*, statut_commercial, statut_facturation

import { useState, useEffect } from 'react'
import { STATUTS_EVENEMENT, LABEL_STATUT_EVENEMENT, LABEL_TYPE_EVENEMENT } from '../data/referentiel'
import { formatDate, formatMontant } from '../utils/dateUtils'
import { getNextAction } from '../utils/getNextAction'
import DossierSelect from '../components/DossierSelect'
import BackupButton from '../components/BackupButton'

export default function Preparateur({ dossiers, updateDossier, selectedId, onNavigate }) {
  const [currentId, setCurrentId] = useState(selectedId || null)
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (selectedId) setCurrentId(selectedId)
  }, [selectedId])

  useEffect(() => {
    if (currentId) {
      const d = dossiers.find((x) => x.id_dossier === currentId)
      if (d) {
        setForm({
          score_completude: d.score_completude ?? 0,
          conducteur_ok: d.conducteur_ok ?? false,
          contact_jour_j: d.contact_jour_j || '',
          statut_evenement: d.statut_evenement || 'a_venir',
        })
        setSaved(false)
      }
    }
  }, [currentId, dossiers])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)
  const action = dossier ? getNextAction(dossier) : null

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setSaved(false)
  }

  function handleSave(e) {
    e.preventDefault()
    if (!currentId || !form) return
    updateDossier(currentId, {
      score_completude: Number(form.score_completude),
      conducteur_ok: form.conducteur_ok,
      contact_jour_j: form.contact_jour_j.trim(),
      statut_evenement: form.statut_evenement,
    })
    setSaved(true)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Préparateur de prestation</div>
          <div className="page-subtitle">Gère score_completude, conducteur_ok, contact_jour_j</div>
        </div>
        <BackupButton dossiers={dossiers} />
      </div>

      <DossierSelect
        dossiers={dossiers}
        selectedId={currentId}
        onChange={setCurrentId}
        label="Dossier à préparer"
        filter={(d) => !['archive','perdu'].includes(d.statut_commercial)}
      />

      <div className="page-content">
        {!dossier ? (
          <div className="empty-state"><p>Sélectionner un dossier actif ci-dessus.</p></div>
        ) : (
          <>
            {/* Info synthétique */}
            <div className="card">
              <div className="card-title">Dossier (lecture)</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Client · Type</label>
                  <div className="readonly-field">
                    {dossier.nom_client} · {LABEL_TYPE_EVENEMENT[dossier.type_evenement]||dossier.type_evenement}
                  </div>
                </div>
                <div className="form-group">
                  <label>Date événement</label>
                  <div className="readonly-field">{formatDate(dossier.date_evenement)}</div>
                </div>
                <div className="form-group">
                  <label>Total</label>
                  <div className="readonly-field">{formatMontant(dossier.total)}</div>
                </div>
                <div className="form-group">
                  <label>Statut commercial</label>
                  <div className="readonly-field">{dossier.statut_commercial}</div>
                </div>
              </div>
            </div>

            {/* Action recommandée */}
            {action && (
              <div className={`action-block ${action.niveau}`}>
                <span className={`badge badge-${action.niveau}`}>Action</span>
                <span className="action-label">{action.label}</span>
              </div>
            )}

            {/* Formulaire préparation */}
            <div className="card">
              <div className="card-title">Préparation prestation</div>
              {saved && (
                <div style={{marginBottom:12,padding:'8px 12px',background:'var(--positif-bg)',borderRadius:6,fontSize:13,color:'var(--positif)',fontWeight:500}}>
                  Enregistré.
                </div>
              )}
              <form onSubmit={handleSave}>
                <div className="form-group" style={{marginBottom:16}}>
                  <label>Score de complétude : <strong>{form.score_completude}%</strong></label>
                  <div className="progress-bar" style={{marginTop:8}}>
                    <div className="progress-fill" style={{width:`${form.score_completude}%`,background: form.score_completude>=80?'var(--positif)':'var(--attention)'}} />
                  </div>
                  <input
                    type="range"
                    name="score_completude"
                    min="0" max="100" step="5"
                    value={form.score_completude}
                    onChange={handleChange}
                    style={{width:'100%',marginTop:6}}
                  />
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-muted)'}}>
                    <span>0%</span>
                    <span style={{color:'var(--attention)'}}>80% (seuil attention)</span>
                    <span style={{color:'var(--positif)'}}>100%</span>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Contact Jour J</label>
                    <input
                      type="text"
                      name="contact_jour_j"
                      value={form.contact_jour_j}
                      onChange={handleChange}
                      placeholder="Prénom Nom — 06 XX XX XX XX"
                    />
                  </div>
                  <div className="form-group">
                    <label>Statut événement</label>
                    <select name="statut_evenement" value={form.statut_evenement} onChange={handleChange}>
                      {STATUTS_EVENEMENT.map((s) => (
                        <option key={s} value={s}>{LABEL_STATUT_EVENEMENT[s]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{marginTop:14}}>
                  <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:14}}>
                    <input
                      type="checkbox"
                      name="conducteur_ok"
                      checked={form.conducteur_ok}
                      onChange={handleChange}
                      style={{width:16,height:16}}
                    />
                    Conducteur de soirée validé
                  </label>
                </div>

                <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-secondary" onClick={()=>onNavigate('checklist',currentId)}>Checklist Jour J</button>
                  <button type="button" className="btn btn-secondary" onClick={()=>onNavigate('conducteur',currentId)}>Conducteur</button>
                  <button type="submit" className="btn btn-primary">Enregistrer</button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
