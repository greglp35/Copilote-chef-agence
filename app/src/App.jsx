import { useState } from 'react'
import { useDossiers } from './hooks/useDossiers'
import Layout from './components/Layout'
import Assistant from './modules/Assistant'
import Configurateur from './modules/Configurateur'
import Suivi from './modules/Suivi'
import Preparateur from './modules/Preparateur'
import Dashboard from './modules/Dashboard'
import FicheClient from './modules/FicheClient'
import Checklist from './modules/Checklist'
import Conducteur from './modules/Conducteur'

export default function App() {
  const [currentModule, setCurrentModule] = useState('assistant')
  const [selectedDossierId, setSelectedDossierId] = useState(null)

  const {
    dossiers,
    saveDossiers,
    updateDossier,
    addDossier,
    refresh,
    isDemoMode,
    generateIdDossier,
    generateRefDevis,
  } = useDossiers()

  // Navigation entre modules — peut transporter un dossierId
  function handleNavigate(module, dossierId) {
    setCurrentModule(module)
    if (dossierId !== undefined) setSelectedDossierId(dossierId)
  }

  // Props communs à tous les modules
  const sharedProps = {
    dossiers,
    onNavigate: handleNavigate,
    selectedId: selectedDossierId,
  }

  function renderModule() {
    switch (currentModule) {
      case 'assistant':
        return <Assistant {...sharedProps} />

      case 'configurateur':
        return (
          <Configurateur
            {...sharedProps}
            addDossier={addDossier}
            generateIdDossier={generateIdDossier}
            generateRefDevis={generateRefDevis}
          />
        )

      case 'suivi':
        return <Suivi {...sharedProps} updateDossier={updateDossier} />

      case 'preparateur':
        return <Preparateur {...sharedProps} updateDossier={updateDossier} />

      case 'dashboard':
        return <Dashboard {...sharedProps} />

      case 'fiche_client':
        return <FicheClient {...sharedProps} />

      case 'checklist':
        return <Checklist {...sharedProps} />

      case 'conducteur':
        return <Conducteur {...sharedProps} />

      default:
        return <Assistant {...sharedProps} />
    }
  }

  return (
    <Layout current={currentModule} onNavigate={handleNavigate} isDemoMode={isDemoMode}>
      {renderModule()}
    </Layout>
  )
}
