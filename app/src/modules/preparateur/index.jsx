// PRÉPARATEUR DE PRESTATION — règle 26
// Propriétaire : score_completude, conducteur_ok, contact_jour_j, statut_evenement
// Ne modifie pas : montants, statut_commercial, statut_facturation

import { useState, useEffect } from 'react'
import { STATUTS_EVENEMENT, LABEL_STATUT_EVENEMENT, LABEL_TYPE_EVENEMENT } from '../../data/referentiel'
import { formatDate, formatMontant } from '../../lib/format'
import { getNextAction } from '../../lib/rules'
import DossierSelect from '../../components/DossierSelect'
import BackupButton from '../../components/BackupButton'

export default function Preparateur({ dossiers, updateDossier, selectedId, onNavigate }) {
  const [currentId, setCurrentId] = useState(selectedId || null)
  const [form, setForm]           = useState(null)
  const [saved, setSaved]         = useState(false)

  useEffect(() => { if (selectedId) setCurrentId(selectedId) }, [selectedId])

  useEffect(() => {
    const d = dossiers.find((x) => x.id_dossier === currentId)
    if (d) {
      setForm({
        score_completude: d.score_completude ?? 0,
        conducteur_ok:    d.conducteur_ok    ?? false,
        contact_jour_j:   d.contact_jour_j   || '',
        statut_evenement: d.statut_evenement || 'a_venir',
      })
      setSaved(false)
    }
  }, [currentId, dossiers])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)
  const action  = dossier ? getNextAction(dossier) : null

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setSaved(false)
  }

  function handleSave(e) {
    e.preventDefault()
    if (!currentId || !form) return
    updateDossier(currentId, {
      score_completude: Number(form.score_completude),
      conducteur_ok:    form.conducteur_ok,
      contact_jour_j:   form.contact_jour_j.trim(),
      statut_evenement: form.statut_evenement,
    })
    setSaved(true)
  }

  const sc = form?.score_completude || 0
  const fillClass = sc >= 80 ? 'fill-positif' : sc >= 50 ? 'fill-attention' : 'fill-urgent'

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

      <div className="page-body">
        {!dossier ? (
          <div className="empty"><p>Sélectionner un dossier actif.</p></div>
        ) : (
          <>
            <div className="card">
              <div className="card-title">Dossier (lecture)</div>
              <div className="form-grid">
                <div className="field"><label>Client · Type</label><div className="read-value">{dossier.nom_client} · {LABEL_TYPE_EVENEMENT[dossier.type_evenement] || dossier.type_evenement}</div></div>
                <div className="field"><label>Date événement</label><div className="read-value">{formatDate(dossier.date_evenement)}</div></div>
                <div className="field"><label>Total</label><div className="read-value">{formatMontant(dossier.total)}</div></div>
                <div className="field"><label>Statut commercial</label><div className="read-value">{dossier.statut_commercial}</div></div>
              </div>
            </div>

            {action && (
              <div className={`action-block ${action.niveau}`}>
                <span className={`badge badge-${action.niveau}`}>Action</span>
                <span className="action-label">{action.label}</span>
              </div>
            )}

            <div className="card">
              <div className="card-title">Préparation</div>
              {saved && <div className="alert alert-success">Enregistré.</div>}
              <form onSubmit={handleSave}>
                <div className="field" style={{marginBottom:16}}>
                  <label>Score de complétude : <strong>{sc}%</strong></label>
                  <div className="progress-track" style={{margin:'8px 0 4px'}}>
                    <div className={`progress-fill ${fillClass}`} style={{width:`${sc}%`}} />
                  </div>
                  <input type="range" name="score_completude" min="0" max="100" step="5" value={sc} onChange={handleChange} style={{width:'100%'}} />
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-muted)'}}>
                    <span>0%</span><span>80% seuil</span><span>100%</span>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Contact Jour J</label>
                    <input type="text" name="contact_jour_j" value={form.contact_jour_j} onChange={handleChange} placeholder="Prénom Nom — 06 XX XX XX XX" />
                  </div>
                  <div className="field">
                    <label>Statut événement</label>
                    <select name="statut_evenement" value={form.statut_evenement} onChange={handleChange}>
                      {STATUTS_EVENEMENT.map((s) => <option key={s} value={s}>{LABEL_STATUT_EVENEMENT[s]}</option>)}
                    </select>
                  </div>
                </div>

                <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',marginTop:14,fontSize:14}}>
                  <input type="checkbox" name="conducteur_ok" checked={form.conducteur_ok} onChange={handleChange} style={{width:16,height:16}} />
                  Conducteur de soirée validé
                </label>

                <div className="btn-row" style={{marginTop:16,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigate('checklist', currentId)}>Checklist</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNavigate('conducteur', currentId)}>Conducteur</button>
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
