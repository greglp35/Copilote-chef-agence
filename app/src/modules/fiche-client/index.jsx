// FICHE CLIENT INTELLIGENTE — règle 35
// 100% lecture seule + navigation rapide vers modules d'action

import { useState, useEffect } from 'react'
import { LABEL_STATUT_COMMERCIAL, LABEL_STATUT_FACTURATION, LABEL_STATUT_EVENEMENT, LABEL_TYPE_EVENEMENT } from '../../data/referentiel'
import { formatDate, formatMontant } from '../../lib/format'
import { diffDays } from '../../lib/dates'
import { getNextAction } from '../../lib/rules'
import DossierSelect from '../../components/DossierSelect'
import BackupButton from '../../components/BackupButton'

function ReadField({ label, value, mono, highlight }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="read-value" style={mono ? {fontFamily:'monospace',fontSize:13} : highlight ? {color:highlight,fontWeight:600} : {}}>
        {value || '—'}
      </div>
    </div>
  )
}

export default function FicheClient({ dossiers, selectedId, onNavigate }) {
  const [currentId, setCurrentId] = useState(selectedId || null)
  useEffect(() => { if (selectedId) setCurrentId(selectedId) }, [selectedId])

  const dossier = dossiers.find((d) => d.id_dossier === currentId)
  const action  = dossier ? getNextAction(dossier) : null
  const jj      = dossier?.date_evenement ? diffDays(dossier.date_evenement) : null

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

      <div className="page-body">
        {!dossier ? (
          <div className="empty"><p>Sélectionner un dossier pour afficher sa fiche.</p></div>
        ) : (
          <>
            {action && (
              <div className={`action-block ${action.niveau}`}>
                <span className={`badge badge-${action.niveau}`}>Prochaine action</span>
                <span className="action-label">{action.label}</span>
              </div>
            )}

            <div className="card">
              <div className="card-title">Identité</div>
              <div className="form-grid">
                <ReadField label="ID dossier" value={dossier.id_dossier} mono />
                <ReadField label="Référence devis" value={dossier.ref_devis} mono />
                <ReadField label="Nom client" value={dossier.nom_client} />
                <ReadField label="Type événement" value={LABEL_TYPE_EVENEMENT[dossier.type_evenement] || dossier.type_evenement} />
                <div className="field">
                  <label>Date événement</label>
                  <div className="read-value">
                    {formatDate(dossier.date_evenement)}
                    {jj !== null && (
                      <span style={{marginLeft:8,fontSize:12,fontWeight:600,color:jj<=0?'var(--text-muted)':jj<=7?'var(--urgent)':jj<=30?'var(--attention)':'var(--text-muted)'}}>
                        ({jj > 0 ? `dans ${jj} j` : jj === 0 ? "Aujourd'hui" : `il y a ${-jj} j`})
                      </span>
                    )}
                  </div>
                </div>
                <div className="field">
                  <label>Statut commercial</label>
                  <div className="read-value">
                    <span className={`pill pill-${dossier.statut_commercial}`}>
                      {LABEL_STATUT_COMMERCIAL[dossier.statut_commercial] || 'Statut non reconnu — vérifier le dossier'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Paiements</div>
              <div className="form-grid">
                <ReadField label="Total" value={formatMontant(dossier.total)} />
                <ReadField label="Acompte attendu" value={formatMontant(dossier.acompte_attendu)} />
                <div className="field">
                  <label>Acompte reçu</label>
                  <div className="read-value" style={{color:dossier.acompte_recu>0?'var(--positif)':'var(--attention)'}}>
                    {formatMontant(dossier.acompte_recu)}
                    {dossier.acompte_attendu > 0 && !dossier.acompte_recu && <span style={{fontSize:11,marginLeft:6}}>(en attente)</span>}
                  </div>
                </div>
                <ReadField label="Solde attendu" value={formatMontant(dossier.solde_attendu)} />
                <div className="field">
                  <label>Solde reçu</label>
                  <div className="read-value" style={{color:dossier.solde_recu>0?'var(--positif)':'var(--text-muted)'}}>
                    {formatMontant(dossier.solde_recu)}
                  </div>
                </div>
                <ReadField label="Statut facturation" value={LABEL_STATUT_FACTURATION[dossier.statut_facturation] || dossier.statut_facturation} />
              </div>
            </div>

            <div className="card">
              <div className="card-title">Préparation</div>
              <div className="form-grid">
                <div className="field">
                  <label>Score complétude : {dossier.score_completude ?? 0}%</label>
                  <div className="progress-track" style={{marginTop:6}}>
                    <div className={`progress-fill ${(dossier.score_completude||0)>=80?'fill-positif':'fill-attention'}`} style={{width:`${dossier.score_completude||0}%`}} />
                  </div>
                </div>
                <div className="field">
                  <label>Conducteur validé</label>
                  <div className="read-value" style={{color:dossier.conducteur_ok?'var(--positif)':'var(--attention)'}}>{dossier.conducteur_ok ? 'Oui' : 'Non'}</div>
                </div>
                <div className="field full-span">
                  <label>Contact Jour J</label>
                  <div className="read-value">{dossier.contact_jour_j || '— Non renseigné'}</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Méta</div>
              <div className="form-grid">
                <ReadField label="Statut événement" value={LABEL_STATUT_EVENEMENT[dossier.statut_evenement] || dossier.statut_evenement} />
                <ReadField label="Date création" value={formatDate(dossier._meta?.date_creation)} />
                <ReadField label="Dernière modification" value={formatDate(dossier._meta?.derniere_modification)} />
              </div>
              {dossier.note && <div style={{marginTop:8,fontSize:13,color:'var(--text-muted)'}}>Note : {dossier.note}</div>}
            </div>

            <div className="card">
              <div className="card-title">Actions rapides</div>
              <div className="btn-row">
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate('suivi', currentId)}>Suivi commercial</button>
                <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('preparateur', currentId)}>Préparateur</button>
                <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('checklist', currentId)}>Checklist</button>
                <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('conducteur', currentId)}>Conducteur</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
