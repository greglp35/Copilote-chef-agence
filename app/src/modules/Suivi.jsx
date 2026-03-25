// SUIVI COMMERCIAL & PAIEMENTS — règle 25
// Propriétaire exclusif de statut_commercial, acompte_recu, solde_recu, statut_facturation
// Ne modifie PAS total, acompte_attendu, solde_attendu (lecture seule sur ces champs)

import { useState, useEffect } from 'react'
import { STATUTS_COMMERCIAL, STATUTS_FACTURATION, LABEL_STATUT_COMMERCIAL, LABEL_STATUT_FACTURATION, LABEL_TYPE_EVENEMENT } from '../data/referentiel'
import { formatDate, formatMontant, todayISOString } from '../utils/dateUtils'
import { getNextAction } from '../utils/getNextAction'
import DossierSelect from '../components/DossierSelect'
import BackupButton from '../components/BackupButton'

export default function Suivi({ dossiers, updateDossier, selectedId, onNavigate }) {
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
          statut_commercial: d.statut_commercial || 'devis_a_envoyer',
          statut_facturation: d.statut_facturation || 'non_emise',
          acompte_recu: d.acompte_recu ?? 0,
          solde_recu: d.solde_recu ?? 0,
        })
        setSaved(false)
      }
    }
  }, [currentId, dossiers])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  function handleSave(e) {
    e.preventDefault()
    if (!currentId || !form) return
    updateDossier(currentId, {
      statut_commercial: form.statut_commercial,
      statut_facturation: form.statut_facturation,
      acompte_recu: Number(form.acompte_recu) || 0,
      solde_recu: Number(form.solde_recu) || 0,
    })
    setSaved(true)
  }

  const action = dossier ? getNextAction(dossier) : null

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Suivi commercial & paiements</div>
          <div className="page-subtitle">Propriétaire de statut_commercial, acompte_recu, solde_recu</div>
        </div>
        <BackupButton dossiers={dossiers} />
      </div>

      <DossierSelect
        dossiers={dossiers}
        selectedId={currentId}
        onChange={setCurrentId}
        label="Dossier à traiter"
      />

      <div className="page-content">
        {!dossier ? (
          <div className="empty-state"><p>Sélectionner un dossier ci-dessus.</p></div>
        ) : (
          <>
            {/* Info dossier en lecture */}
            <div className="card">
              <div className="card-title">Informations dossier (lecture)</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>ID dossier</label>
                  <div className="readonly-field">{dossier.id_dossier}</div>
                </div>
                <div className="form-group">
                  <label>Référence devis</label>
                  <div className="readonly-field">{dossier.ref_devis}</div>
                </div>
                <div className="form-group">
                  <label>Client</label>
                  <div className="readonly-field">{dossier.nom_client}</div>
                </div>
                <div className="form-group">
                  <label>Type · Date</label>
                  <div className="readonly-field">
                    {LABEL_TYPE_EVENEMENT[dossier.type_evenement]||dossier.type_evenement} · {formatDate(dossier.date_evenement)}
                  </div>
                </div>
                <div className="form-group">
                  <label>Total (fixé par configurateur)</label>
                  <div className="readonly-field" style={{fontWeight:600}}>{formatMontant(dossier.total)}</div>
                </div>
                <div className="form-group">
                  <label>Acompte attendu (fixé)</label>
                  <div className="readonly-field">{formatMontant(dossier.acompte_attendu)}</div>
                </div>
                <div className="form-group">
                  <label>Solde attendu (fixé)</label>
                  <div className="readonly-field">{formatMontant(dossier.solde_attendu)}</div>
                </div>
                <div className="form-group">
                  <label>Dernière modification</label>
                  <div className="readonly-field">{dossier._meta?.derniere_modification || '—'}</div>
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

            {/* Formulaire suivi */}
            <div className="card">
              <div className="card-title">Mise à jour commerciale</div>
              {saved && (
                <div style={{marginBottom:12,padding:'8px 12px',background:'var(--positif-bg)',borderRadius:6,fontSize:13,color:'var(--positif)',fontWeight:500}}>
                  Enregistré avec succès.
                </div>
              )}
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Statut commercial</label>
                    <select name="statut_commercial" value={form.statut_commercial} onChange={handleChange}>
                      {STATUTS_COMMERCIAL.map((s) => (
                        <option key={s} value={s}>{LABEL_STATUT_COMMERCIAL[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Statut facturation</label>
                    <select name="statut_facturation" value={form.statut_facturation} onChange={handleChange}>
                      {STATUTS_FACTURATION.map((s) => (
                        <option key={s} value={s}>{LABEL_STATUT_FACTURATION[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Acompte reçu (€)</label>
                    <input type="number" name="acompte_recu" value={form.acompte_recu} onChange={handleChange} min="0" step="10" />
                  </div>
                  <div className="form-group">
                    <label>Solde reçu (€)</label>
                    <input type="number" name="solde_recu" value={form.solde_recu} onChange={handleChange} min="0" step="10" />
                  </div>
                </div>

                {/* Récap paiements */}
                {form && (
                  <div style={{marginTop:12,padding:'10px 12px',background:'var(--neutre-bg)',borderRadius:6,fontSize:13}}>
                    <strong>Récap paiements :</strong>
                    &nbsp;Attendu : {formatMontant(dossier.total)}
                    &nbsp;· Reçu acompte : {formatMontant(Number(form.acompte_recu))}
                    &nbsp;· Reçu solde : {formatMontant(Number(form.solde_recu))}
                    &nbsp;· Reste : {formatMontant(dossier.total - Number(form.acompte_recu) - Number(form.solde_recu))}
                  </div>
                )}

                <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-secondary" onClick={()=>onNavigate('fiche_client',currentId)}>Voir la fiche</button>
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
