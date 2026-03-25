const MODULES = [
  { id: 'assistant',     label: 'Assistant' },
  { id: 'configurateur', label: 'Configurateur' },
  { id: 'suivi',         label: 'Suivi commercial' },
  { id: 'preparateur',   label: 'Préparateur' },
  { id: 'dashboard',     label: 'Dashboard KPI' },
  { id: 'fiche_client',  label: 'Fiche client' },
  { id: 'checklist',     label: 'Checklist Jour J' },
  { id: 'conducteur',    label: 'Conducteur' },
]

export default function Layout({ current, onNavigate, isDemoMode, children }) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          DMA DJ
          <span>Copilote v1.1</span>
        </div>
        <nav className="sidebar-nav">
          {MODULES.map((m) => (
            <button
              key={m.id}
              className={`nav-item${current === m.id ? ' active' : ''}`}
              onClick={() => onNavigate(m.id)}
            >
              <span className="nav-item-label">{m.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-version">MVP v1.1</div>
      </aside>

      <main className="main">
        {isDemoMode && (
          <div className="bandeau-demo">
            ⚠ Mode démo — aucune donnée réelle — créez un dossier dans le Configurateur pour démarrer
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
