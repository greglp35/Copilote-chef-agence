// SUIVI COMMERCIAL & PAIEMENTS — règle 25
// Propriétaire exclusif : statut_commercial, acompte_recu, solde_recu, statut_facturation
// Lecture seule : total, acompte_attendu, solde_attendu

import { useState, useEffect } from 'react'
import { STATUTS_COMMERCIAL, STATUTS_FACTURATION, LABEL_STATUT_COMMERCIAL, LABEL_STATUT_FACTURATION, LABEL_TYPE_EVENEMENT } from '../../data/referentiel'
import { formatDate, formatMontant } from '../../lib/format'
import { getNextAction } from '../../lib/rules'
import DossierSelect from '../../components/DossierSelect'
import BackupButton from '../../components/BackupButton'

export default function Suivi({ dossiers, updateDossier, selectedId, onNavigate }) {
  const [currentId, setCurrentId] = useState(selectedId || null)
  const [form, setForm]           = useState(null)
  const [saved, setSaved]         = useState(false)

  useEffect(() => { if (selectedId) setCurrentId(selectedId) }, [selectedId])

  useEffect(() => {
    const d = dossiers.find((x) => x.id_dossier === currentId)
    if (d) {
      setForm({
        statut_commercial:  d.statut_commercial  || 'devis_a_envoyer',
        statut_facturation: d.statut_facturation || 'non_emise',
        acompte_recu: d.acompte_recu ?? 0,
        solde_recu:   d.solde_recu   ?? 0,
      })
      setSaved(false)
    }
  }, [currentId, dossiers])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)
  const action  = dossier ? getNextAction(dossier) : null

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  function handleSave(e) {
    e.preventDefault()
    if (!currentId || !form) return
    updateDossier(currentId, {
      statut_commercial:  form.statut_commercial,
      statut_facturation: form.statut_facturation,
      acompte_recu: Number(form.acompte_recu) || 0,
      solde_recu:   Number(form.solde_recu)   || 0,
    })
    setSaved(true)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Suivi commercial & paiements</div>
          <div className="page-subtitle">Propriétaire de statut_commercial, acompte_recu, solde_recu</div>
        </div>
        <BackupButton dossiers={dossiers} />
      </div>

      <DossierSelect dossiers={dossiers} selectedId={currentId} onChange={setCurrentId} label="Dossier à traiter" />

      <div className="page-body">
        {!dossier ? (
          <div className="empty"><p>Sélectionner un dossier.</p></div>
        ) : (
          <>
            <div className="card">
              <div className="card-title">Informations (lecture)</div>
              <div className="form-grid">
                <div className="field"><label>ID dossier</label><div className="read-value mono">{dossier.id_dossier}</div></div>
                <div className="field"><label>Référence devis</label><div className="read-value mono">{dossier.ref_devis}</div></div>
                <div className="field"><label>Client</label><div className="read-value">{dossier.nom_client}</div></div>
                <div className="field"><label>Type · Date</label><div className="read-value">{LABEL_TYPE_EVENEMENT[dossier.type_evenement] || dossier.type_evenement} · {formatDate(dossier.date_evenement)}</div></div>
                <div className="field"><label>Total (fixé par configurateur)</label><div className="read-value" style={{fontWeight:600}}>{formatMontant(dossier.total)}</div></div>
                <div className="field"><label>Acompte attendu (fixé)</label><div className="read-value">{formatMontant(dossier.acompte_attendu)}</div></div>
                <div className="field"><label>Solde attendu (fixé)</label><div className="read-value">{formatMontant(dossier.solde_attendu)}</div></div>
                <div className="field"><label>Dernière modif.</label><div className="read-value">{dossier._meta?.derniere_modification || '—'}</div></div>
              </div>
            </div>

            {action && (
              <div className={`action-block ${action.niveau}`}>
                <span className={`badge badge-${action.niveau}`}>Action</span>
                <span className="action-label">{action.label}</span>
              </div>
            )}

            <div className="card">
              <div className="card-title">Mise à jour commerciale</div>
              {saved && <div className="alert alert-success">Enregistré avec succès.</div>}
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="field">
                    <label>Statut commercial</label>
                    <select name="statut_commercial" value={form.statut_commercial} onChange={handleChange}>
                      {STATUTS_COMMERCIAL.map((s) => <option key={s} value={s}>{LABEL_STATUT_COMMERCIAL[s]}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Statut facturation</label>
                    <select name="statut_facturation" value={form.statut_facturation} onChange={handleChange}>
                      {STATUTS_FACTURATION.map((s) => <option key={s} value={s}>{LABEL_STATUT_FACTURATION[s]}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Acompte reçu (€)</label>
                    <input type="number" name="acompte_recu" value={form.acompte_recu} onChange={handleChange} min="0" step="10" />
                  </div>
                  <div className="field">
                    <label>Solde reçu (€)</label>
                    <input type="number" name="solde_recu" value={form.solde_recu} onChange={handleChange} min="0" step="10" />
                  </div>
                </div>
                {form && (
                  <div className="alert alert-info" style={{marginTop:12}}>
                    Attendu : {formatMontant(dossier.total)} · Reçu : {formatMontant(Number(form.acompte_recu) + Number(form.solde_recu))} · Reste : {formatMontant(dossier.total - Number(form.acompte_recu) - Number(form.solde_recu))}
                  </div>
                )}
                <div className="btn-row" style={{marginTop:14,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-secondary" onClick={() => onNavigate('fiche-client', currentId)}>Voir la fiche</button>
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
