// CONFIGURATEUR — règle 24
// SEUL module autorisé à générer id_dossier et ref_devis
// SEUL module qui fixe total, acompte_attendu, solde_attendu

import { useState } from 'react'
import { TYPES_EVENEMENT, LABEL_TYPE_EVENEMENT, LABEL_STATUT_COMMERCIAL } from '../../data/referentiel'
import { formatDate, formatMontant } from '../../lib/format'
import { todayISO } from '../../lib/dates'
import BackupButton from '../../components/BackupButton'

const EMPTY = { nom_client: '', type_evenement: 'mariage', date_evenement: '', total: '', acompte_attendu: '', note: '' }

export default function Configurateur({ dossiers, addDossier, onNavigate, generateIdDossier, generateRefDevis }) {
  const [form, setForm]     = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saved, setSaved]   = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.nom_client.trim()) e.nom_client = 'Requis'
    if (!form.date_evenement)    e.date_evenement = 'Requis'
    if (!form.total || Number(form.total) <= 0) e.total = 'Montant invalide'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const total           = Number(form.total)
    const acompte_attendu = form.acompte_attendu !== '' ? Number(form.acompte_attendu) : Math.round(total * 0.3)
    const solde_attendu   = total - acompte_attendu
    const id_dossier      = generateIdDossier(dossiers)
    const ref_devis       = generateRefDevis(dossiers)
    const now             = todayISO()

    const d = {
      id_dossier, ref_devis,
      nom_client: form.nom_client.trim(),
      date_evenement: form.date_evenement,
      type_evenement: form.type_evenement,
      statut_commercial:  'devis_a_envoyer',
      statut_facturation: 'non_emise',
      statut_evenement:   'a_venir',
      total, acompte_attendu, solde_attendu,
      acompte_recu: 0, solde_recu: 0,
      score_completude: 0,
      conducteur_ok: false,
      contact_jour_j: '',
      note: form.note.trim(),
      _meta: { date_creation: now, derniere_modification: now },
    }

    addDossier(d)
    setSaved(d)
    setForm(EMPTY)
  }

  const soldePreview = form.total
    ? (form.acompte_attendu !== ''
        ? Number(form.total) - Number(form.acompte_attendu)
        : Math.round(Number(form.total) * 0.7))
    : null

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Configurateur de devis</div>
          <div className="page-subtitle">Source unique de id_dossier, ref_devis et montants</div>
        </div>
        <BackupButton dossiers={dossiers} />
      </div>

      <div className="page-body">
        {saved && (
          <div className="card" style={{borderLeft:'3px solid var(--positif)',background:'var(--positif-bg)'}}>
            <strong>Dossier créé :</strong> {saved.id_dossier} · {saved.ref_devis} · {saved.nom_client} · {formatDate(saved.date_evenement)} · {formatMontant(saved.total)}
            <div className="btn-row" style={{marginTop:10}}>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('suivi', saved.id_dossier)}>Ouvrir dans Suivi</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setSaved(null)}>Créer un autre</button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-title">Nouveau dossier</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Nom client *</label>
                <input name="nom_client" value={form.nom_client} onChange={handleChange} placeholder="Famille Dupont" />
                {errors.nom_client && <span className="field-error">{errors.nom_client}</span>}
              </div>
              <div className="field">
                <label>Type d'événement</label>
                <select name="type_evenement" value={form.type_evenement} onChange={handleChange}>
                  {TYPES_EVENEMENT.map((t) => <option key={t} value={t}>{LABEL_TYPE_EVENEMENT[t]}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Date événement *</label>
                <input type="date" name="date_evenement" value={form.date_evenement} onChange={handleChange} />
                {errors.date_evenement && <span className="field-error">{errors.date_evenement}</span>}
              </div>
              <div className="field">
                <label>Total (€) *</label>
                <input type="number" name="total" value={form.total} onChange={handleChange} placeholder="2500" min="0" step="10" />
                {errors.total && <span className="field-error">{errors.total}</span>}
              </div>
              <div className="field">
                <label>Acompte attendu (€) <span style={{fontWeight:400}}>(vide = 30% auto)</span></label>
                <input type="number" name="acompte_attendu" value={form.acompte_attendu} onChange={handleChange} placeholder="750" min="0" />
              </div>
              <div className="field">
                <label>Solde attendu (calculé)</label>
                <div className="read-value">{soldePreview !== null ? formatMontant(soldePreview) : '—'}</div>
              </div>
              <div className="field full-span">
                <label>Note interne</label>
                <textarea name="note" value={form.note} onChange={handleChange} rows={2} placeholder="Contraintes, infos particulières..." />
              </div>
            </div>
            <div style={{marginTop:16,paddingTop:12,borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
              <span style={{fontSize:12,color:'var(--text-muted)'}}>
                statut initial : <strong>devis_a_envoyer</strong> · facturation : <strong>non_emise</strong>
              </span>
              <button type="submit" className="btn btn-primary">Créer le dossier</button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-title">Dossiers existants ({dossiers.length})</div>
          {dossiers.length === 0
            ? <div className="empty"><p>Aucun dossier.</p></div>
            : (
              <table className="data-table">
                <thead><tr><th>ID</th><th>Référence</th><th>Client</th><th>Type</th><th>Date</th><th>Total</th><th>Acompte att.</th><th>Solde att.</th><th>Statut</th><th></th></tr></thead>
                <tbody>
                  {dossiers.map((d) => (
                    <tr key={d.id_dossier}>
                      <td><span className="mono">{d.id_dossier}</span></td>
                      <td><span className="mono">{d.ref_devis}</span></td>
                      <td><span className="bold">{d.nom_client}</span></td>
                      <td>{LABEL_TYPE_EVENEMENT[d.type_evenement] || d.type_evenement}</td>
                      <td>{formatDate(d.date_evenement)}</td>
                      <td>{formatMontant(d.total)}</td>
                      <td>{formatMontant(d.acompte_attendu)}</td>
                      <td>{formatMontant(d.solde_attendu)}</td>
                      <td><span className={`pill pill-${d.statut_commercial}`}>{LABEL_STATUT_COMMERCIAL[d.statut_commercial] || d.statut_commercial}</span></td>
                      <td><button className="btn btn-secondary btn-sm" onClick={() => onNavigate('suivi', d.id_dossier)}>Suivi</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  )
}
