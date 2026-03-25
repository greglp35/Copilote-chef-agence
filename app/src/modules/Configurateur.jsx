// CONFIGURATEUR DE DEVIS — règle 24
// SEUL module autorisé à générer id_dossier et ref_devis
// SEUL module qui fixe total, acompte_attendu, solde_attendu

import { useState } from 'react'
import { TYPES_EVENEMENT, LABEL_TYPE_EVENEMENT, STATUTS_FACTURATION, LABEL_STATUT_COMMERCIAL } from '../data/referentiel'
import { formatDate, formatMontant, todayISOString } from '../utils/dateUtils'
import BackupButton from '../components/BackupButton'

const EMPTY_FORM = {
  nom_client: '',
  type_evenement: 'mariage',
  date_evenement: '',
  total: '',
  acompte_attendu: '',
  note: '',
}

export default function Configurateur({ dossiers, addDossier, onNavigate, generateIdDossier, generateRefDevis }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [editMode, setEditMode] = useState(false) // création uniquement en V1
  const [saved, setSaved] = useState(null)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      // Suggestion auto solde = total - acompte
      if (name === 'total' || name === 'acompte_attendu') {
        // juste pour affichage live — le solde_attendu sera calculé à la sauvegarde
      }
      return next
    })
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.nom_client.trim()) e.nom_client = 'Requis'
    if (!form.date_evenement) e.date_evenement = 'Requis'
    if (!form.total || isNaN(Number(form.total)) || Number(form.total) <= 0) e.total = 'Montant invalide'
    if (form.acompte_attendu !== '' && (isNaN(Number(form.acompte_attendu)) || Number(form.acompte_attendu) < 0)) e.acompte_attendu = 'Montant invalide'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const total = Number(form.total)
    const acompte_attendu = form.acompte_attendu !== '' ? Number(form.acompte_attendu) : Math.round(total * 0.3)
    const solde_attendu = total - acompte_attendu

    // id_dossier et ref_devis générés ici — règle 38 §3 point 1
    const id_dossier = generateIdDossier(dossiers)
    const ref_devis  = generateRefDevis(dossiers)
    const today = todayISOString()

    const newDossier = {
      id_dossier,
      ref_devis,
      nom_client: form.nom_client.trim(),
      date_evenement: form.date_evenement,
      type_evenement: form.type_evenement,
      statut_commercial: 'devis_a_envoyer',     // statut initial obligatoire
      statut_facturation: 'non_emise',           // règle 38 §3 point 5
      statut_evenement: 'a_venir',
      total,
      acompte_attendu,
      acompte_recu: 0,
      solde_attendu,
      solde_recu: 0,
      score_completude: 0,
      conducteur_ok: false,
      contact_jour_j: '',
      note: form.note.trim(),
      _meta: {
        date_creation: today,
        derniere_modification: today,
      },
    }

    addDossier(newDossier)
    setSaved(newDossier)
    setForm(EMPTY_FORM)
  }

  const soldePreview =
    form.total && form.acompte_attendu
      ? Number(form.total) - Number(form.acompte_attendu)
      : form.total
      ? Math.round(Number(form.total) * 0.7)
      : null

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Configurateur de devis</div>
          <div className="page-subtitle">Créer un nouveau dossier — source de id_dossier et des montants</div>
        </div>
        <BackupButton dossiers={dossiers} />
      </div>

      <div className="page-content">
        {saved && (
          <div className="card" style={{borderLeft:'3px solid var(--positif)',background:'var(--positif-bg)'}}>
            <strong>Dossier créé avec succès</strong>
            <div style={{marginTop:8,fontSize:13}}>
              {saved.id_dossier} · {saved.ref_devis} · {saved.nom_client} · {formatDate(saved.date_evenement)} · {formatMontant(saved.total)}
            </div>
            <div className="btn-group" style={{marginTop:10}}>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('suivi', saved.id_dossier)}>
                Ouvrir dans Suivi
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setSaved(null)}>
                Créer un autre dossier
              </button>
            </div>
          </div>
        )}

        {/* Formulaire de création */}
        <div className="card">
          <div className="card-title">Nouveau dossier</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nom client *</label>
                <input name="nom_client" value={form.nom_client} onChange={handleChange} placeholder="Famille Dupont" />
                {errors.nom_client && <span style={{color:'var(--urgent)',fontSize:11}}>{errors.nom_client}</span>}
              </div>
              <div className="form-group">
                <label>Type d'événement</label>
                <select name="type_evenement" value={form.type_evenement} onChange={handleChange}>
                  {TYPES_EVENEMENT.map((t) => (
                    <option key={t} value={t}>{LABEL_TYPE_EVENEMENT[t]}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date de l'événement *</label>
                <input type="date" name="date_evenement" value={form.date_evenement} onChange={handleChange} />
                {errors.date_evenement && <span style={{color:'var(--urgent)',fontSize:11}}>{errors.date_evenement}</span>}
              </div>
              <div className="form-group">
                <label>Total (€) *</label>
                <input type="number" name="total" value={form.total} onChange={handleChange} placeholder="2500" min="0" step="10" />
                {errors.total && <span style={{color:'var(--urgent)',fontSize:11}}>{errors.total}</span>}
              </div>
              <div className="form-group">
                <label>Acompte attendu (€) <span style={{fontWeight:400}}>(laisser vide = 30% auto)</span></label>
                <input type="number" name="acompte_attendu" value={form.acompte_attendu} onChange={handleChange} placeholder="Ex: 750" min="0" />
                {errors.acompte_attendu && <span style={{color:'var(--urgent)',fontSize:11}}>{errors.acompte_attendu}</span>}
              </div>
              <div className="form-group">
                <label>Solde attendu (calculé)</label>
                <div className="readonly-field">
                  {soldePreview !== null ? formatMontant(soldePreview) : '—'}
                </div>
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Note interne</label>
                <textarea name="note" value={form.note} onChange={handleChange} rows={2} placeholder="Notes, contraintes, infos particulières..." />
              </div>
            </div>

            <div style={{marginTop:16,padding:'12px 0',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div style={{fontSize:12,color:'var(--text-muted)'}}>
                statut_commercial initial : <strong>devis_a_envoyer</strong> · statut_facturation initial : <strong>non_emise</strong>
              </div>
              <button type="submit" className="btn btn-primary">Créer le dossier</button>
            </div>
          </form>
        </div>

        {/* Liste dossiers existants */}
        <div className="card">
          <div className="card-title">Dossiers existants ({dossiers.length})</div>
          {dossiers.length === 0
            ? <div className="empty-state"><p>Aucun dossier.</p></div>
            : (
              <table className="dossier-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Référence</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Acompte att.</th>
                    <th>Solde att.</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dossiers.map((d) => (
                    <tr key={d.id_dossier}>
                      <td><span className="dossier-id">{d.id_dossier}</span></td>
                      <td><span className="dossier-id">{d.ref_devis}</span></td>
                      <td><span className="dossier-name">{d.nom_client}</span></td>
                      <td>{LABEL_TYPE_EVENEMENT[d.type_evenement]||d.type_evenement}</td>
                      <td>{formatDate(d.date_evenement)}</td>
                      <td>{formatMontant(d.total)}</td>
                      <td>{formatMontant(d.acompte_attendu)}</td>
                      <td>{formatMontant(d.solde_attendu)}</td>
                      <td><span className={`pill pill-${d.statut_commercial}`}>{LABEL_STATUT_COMMERCIAL[d.statut_commercial]||d.statut_commercial}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={()=>onNavigate('suivi',d.id_dossier)}>Suivi</button>
                      </td>
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
