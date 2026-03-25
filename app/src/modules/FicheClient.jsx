// FICHE CLIENT INTELLIGENTE — règle 35
// Vue synthétique lecture seule d'un dossier + recommandation + navigation rapide

import { useState, useEffect } from 'react'
import { LABEL_STATUT_COMMERCIAL, LABEL_STATUT_FACTURATION, LABEL_STATUT_EVENEMENT, LABEL_TYPE_EVENEMENT } from '../data/referentiel'
import { formatDate, formatMontant, diffDays } from '../utils/dateUtils'
import { getNextAction } from '../utils/getNextAction'
import DossierSelect from '../components/DossierSelect'
import BackupButton from '../components/BackupButton'

function Field({ label, value, mono }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="readonly-field" style={mono ? {fontFamily:'monospace',fontSize:13} : {}}>{value || '—'}</div>
    </div>
  )
}

export default function FicheClient({ dossiers, selectedId, onNavigate }) {
  const [currentId, setCurrentId] = useState(selectedId || null)

  useEffect(() => {
    if (selectedId) setCurrentId(selectedId)
  }, [selectedId])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)
  const action = dossier ? getNextAction(dossier) : null
  const jj = dossier?.date_evenement ? diffDays(dossier.date_evenement) : null

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Fiche client intelligente</div>
          <div className="page-subtitle">Vue synthétique — lecture seule</div>
        </div>
        <BackupButton dossiers={dossiers} />
      </div>

      <DossierSelect dossiers={dossiers} selectedId={currentId} onChange={setCurrentId} label="Dossier" />

      <div className="page-content">
        {!dossier ? (
          <div className="empty-state"><p>Sélectionner un dossier pour voir sa fiche.</p></div>
        ) : (
          <>
            {/* Action recommandée */}
            {action && (
              <div className={`action-block ${action.niveau}`} style={{marginBottom:16}}>
                <span className={`badge badge-${action.niveau}`}>Prochaine action</span>
                <span className="action-label">{action.label}</span>
              </div>
            )}

            {/* Identité */}
            <div className="card">
              <div className="card-title">Identité dossier</div>
              <div className="form-grid">
                <Field label="ID dossier" value={dossier.id_dossier} mono />
                <Field label="Référence devis" value={dossier.ref_devis} mono />
                <Field label="Nom client" value={dossier.nom_client} />
                <Field label="Type événement" value={LABEL_TYPE_EVENEMENT[dossier.type_evenement]||dossier.type_evenement} />
                <div className="form-group">
                  <label>Date événement</label>
                  <div className="readonly-field">
                    {formatDate(dossier.date_evenement)}
                    {jj !== null && (
                      <span style={{marginLeft:8,fontSize:12,color: jj<0?'var(--text-muted)':jj<=7?'var(--urgent)':jj<=30?'var(--attention)':'var(--text-muted)'}}>
                        ({jj >= 0 ? `dans ${jj} j` : `il y a ${-jj} j`})
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Statut commercial</label>
                  <div className="readonly-field">
                    <span className={`pill pill-${dossier.statut_commercial}`}>
                      {LABEL_STATUT_COMMERCIAL[dossier.statut_commercial]||dossier.statut_commercial||'Statut non reconnu — vérifier le dossier'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Paiements */}
            <div className="card">
              <div className="card-title">Paiements</div>
              <div className="form-grid">
                <Field label="Total" value={formatMontant(dossier.total)} />
                <Field label="Acompte attendu" value={formatMontant(dossier.acompte_attendu)} />
                <div className="form-group">
                  <label>Acompte reçu</label>
                  <div className="readonly-field" style={{color: dossier.acompte_recu>0?'var(--positif)':'var(--attention)'}}>
                    {formatMontant(dossier.acompte_recu)}
                    {dossier.acompte_attendu > 0 && dossier.acompte_recu === 0 && <span style={{marginLeft:8,fontSize:11}}>(en attente)</span>}
                  </div>
                </div>
                <Field label="Solde attendu" value={formatMontant(dossier.solde_attendu)} />
                <div className="form-group">
                  <label>Solde reçu</label>
                  <div className="readonly-field" style={{color: dossier.solde_recu>0?'var(--positif)':'var(--text-muted)'}}>
                    {formatMontant(dossier.solde_recu)}
                  </div>
                </div>
                <div className="form-group">
                  <label>Statut facturation</label>
                  <div className="readonly-field">{LABEL_STATUT_FACTURATION[dossier.statut_facturation]||dossier.statut_facturation}</div>
                </div>
              </div>
            </div>

            {/* Préparation */}
            <div className="card">
              <div className="card-title">Préparation</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Score complétude : {dossier.score_completude ?? 0}%</label>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width:`${dossier.score_completude||0}%`}} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Conducteur validé</label>
                  <div className="readonly-field" style={{color: dossier.conducteur_ok?'var(--positif)':'var(--attention)'}}>
                    {dossier.conducteur_ok ? 'Oui' : 'Non'}
                  </div>
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label>Contact Jour J</label>
                  <div className="readonly-field">{dossier.contact_jour_j || '— Non renseigné'}</div>
                </div>
              </div>
            </div>

            {/* Méta */}
            <div className="card">
              <div className="card-title">Métadonnées</div>
              <div className="form-grid">
                <Field label="Statut événement" value={LABEL_STATUT_EVENEMENT[dossier.statut_evenement]||dossier.statut_evenement} />
                <Field label="Date création" value={formatDate(dossier._meta?.date_creation)} />
                <Field label="Dernière modification" value={formatDate(dossier._meta?.derniere_modification)} />
              </div>
              {dossier.note && <div style={{marginTop:8,fontSize:13,color:'var(--text-muted)'}}>Note : {dossier.note}</div>}
            </div>

            {/* Navigation rapide vers autres modules */}
            <div className="card">
              <div className="card-title">Actions rapides</div>
              <div className="btn-group">
                <button className="btn btn-primary btn-sm" onClick={()=>onNavigate('suivi',currentId)}>Suivi commercial</button>
                <button className="btn btn-secondary btn-sm" onClick={()=>onNavigate('preparateur',currentId)}>Préparateur</button>
                <button className="btn btn-secondary btn-sm" onClick={()=>onNavigate('checklist',currentId)}>Checklist Jour J</button>
                <button className="btn btn-secondary btn-sm" onClick={()=>onNavigate('conducteur',currentId)}>Conducteur</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
