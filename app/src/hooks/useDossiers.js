// Clé localStorage figée — règle 38 §3 point 7
// Ne jamais utiliser une variante de cette clé
import { useState, useCallback } from 'react'
import { DEMO_DOSSIERS } from '../data/demoData'
import { todayISOString } from '../utils/dateUtils'

const LS_KEY = 'dma_dossiers'

function readFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { data: null, isDemo: true }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return { data: null, isDemo: true }
    return { data: parsed, isDemo: false }
  } catch (e) {
    console.error('[DMA] Erreur lecture dma_dossiers:', e)
    return { data: null, isDemo: true }
  }
}

export function useDossiers() {
  const initial = readFromStorage()
  const [dossiers, setDossiers] = useState(initial.data ?? DEMO_DOSSIERS)
  const [isDemoMode, setIsDemoMode] = useState(initial.isDemo)

  // Sauvegarde de l'ensemble des dossiers
  const saveDossiers = useCallback((updated) => {
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
    setDossiers(updated)
    setIsDemoMode(false)
  }, [])

  // Mise à jour d'un seul dossier (merge partiel)
  const updateDossier = useCallback((id, patch) => {
    setDossiers((prev) => {
      const updated = prev.map((d) => {
        if (d.id_dossier !== id) return d
        return {
          ...d,
          ...patch,
          _meta: {
            ...d._meta,
            derniere_modification: todayISOString(),
          },
        }
      })
      localStorage.setItem(LS_KEY, JSON.stringify(updated))
      return updated
    })
    setIsDemoMode(false)
  }, [])

  // Ajout d'un nouveau dossier
  const addDossier = useCallback((dossier) => {
    setDossiers((prev) => {
      const updated = [...prev, dossier]
      localStorage.setItem(LS_KEY, JSON.stringify(updated))
      return updated
    })
    setIsDemoMode(false)
  }, [])

  // Rechargement depuis localStorage
  const refresh = useCallback(() => {
    const result = readFromStorage()
    setDossiers(result.data ?? DEMO_DOSSIERS)
    setIsDemoMode(result.isDemo)
  }, [])

  // Génère le prochain id_dossier — USAGE EXCLUSIF DU CONFIGURATEUR
  const generateIdDossier = useCallback((currentDossiers) => {
    const year = new Date().getFullYear()
    const prefix = `DJ-${year}-`
    const max = currentDossiers
      .filter((d) => d.id_dossier?.startsWith(prefix))
      .reduce((m, d) => {
        const n = parseInt(d.id_dossier.replace(prefix, ''), 10)
        return isNaN(n) ? m : Math.max(m, n)
      }, 0)
    return `${prefix}${String(max + 1).padStart(3, '0')}`
  }, [])

  // Génère le prochain ref_devis — USAGE EXCLUSIF DU CONFIGURATEUR
  const generateRefDevis = useCallback((currentDossiers) => {
    const year = new Date().getFullYear()
    const prefix = `DEV-${year}-`
    const max = currentDossiers
      .filter((d) => d.ref_devis?.startsWith(prefix))
      .reduce((m, d) => {
        const n = parseInt(d.ref_devis.replace(prefix, ''), 10)
        return isNaN(n) ? m : Math.max(m, n)
      }, 0)
    return `${prefix}${String(max + 1).padStart(3, '0')}`
  }, [])

  return {
    dossiers,
    saveDossiers,
    updateDossier,
    addDossier,
    refresh,
    isDemoMode,
    generateIdDossier,
    generateRefDevis,
  }
}
