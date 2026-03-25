import { useState } from 'react'
import { useDossiers } from './hooks/useDossiers'
import Layout from './components/Layout'
import Assistant    from './modules/assistant-central/index.jsx'
import Configurateur from './modules/configurateur/index.jsx'
import Suivi        from './modules/suivi/index.jsx'
import Preparateur  from './modules/preparateur/index.jsx'
import Dashboard    from './modules/dashboard/index.jsx'
import FicheClient  from './modules/fiche-client/index.jsx'
import Checklist    from './modules/checklist/index.jsx'
import Conducteur   from './modules/conducteur/index.jsx'

export default function App() {
  const [currentModule, setCurrentModule] = useState('assistant')
  const [selectedDossierId, setSelectedDossierId] = useState(null)

  const {
    dossiers,
    isDemoMode,
    saveDossiers,
    updateDossier,
    addDossier,
    refresh,
    generateIdDossier,
    generateRefDevis,
  } = useDossiers()

  function handleNavigate(module, dossierId) {
    setCurrentModule(module)
    if (dossierId !== undefined) setSelectedDossierId(dossierId)
  }

  const shared = { dossiers, onNavigate: handleNavigate, selectedId: selectedDossierId }

  function renderModule() {
    switch (currentModule) {
      case 'assistant':
        return <Assistant {...shared} />
      case 'configurateur':
        return <Configurateur {...shared} addDossier={addDossier} generateIdDossier={generateIdDossier} generateRefDevis={generateRefDevis} />
      case 'suivi':
        return <Suivi {...shared} updateDossier={updateDossier} />
      case 'preparateur':
        return <Preparateur {...shared} updateDossier={updateDossier} />
      case 'dashboard':
        return <Dashboard {...shared} />
      case 'fiche-client':
        return <FicheClient {...shared} />
      case 'checklist':
        return <Checklist {...shared} />
      case 'conducteur':
        return <Conducteur {...shared} />
      default:
        return <Assistant {...shared} />
    }
  }

  return (
    <Layout current={currentModule} onNavigate={handleNavigate} isDemoMode={isDemoMode}>
      {renderModule()}
    </Layout>
  )
}
