// hooks/useDossiers.js — État React + délégation vers lib/storage
import { useState, useCallback } from 'react'
import {
  readDossiers,
  writeDossiers,
  upsertDossier,
  patchDossier,
  generateIdDossier,
  generateRefDevis,
} from '../lib/storage'
import { DEMO_DOSSIERS } from '../lib/demo-data'

export function useDossiers() {
  const stored = readDossiers()
  const [dossiers, setDossiers] = useState(stored ?? DEMO_DOSSIERS)
  const [isDemoMode, setIsDemoMode] = useState(!stored)

  /** Écrase tout le tableau */
  const saveDossiers = useCallback((updated) => {
    writeDossiers(updated)
    setDossiers(updated)
    setIsDemoMode(false)
  }, [])

  /** Met à jour les champs d'un dossier (patch partiel, met à jour _meta) */
  const updateDossier = useCallback((id, patch) => {
    setDossiers((prev) => {
      const updated = patchDossier(prev, id, patch)
      writeDossiers(updated)
      return updated
    })
    setIsDemoMode(false)
  }, [])

  /** Ajoute un nouveau dossier (via upsert) */
  const addDossier = useCallback((dossier) => {
    setDossiers((prev) => {
      const updated = upsertDossier(prev, dossier)
      writeDossiers(updated)
      return updated
    })
    setIsDemoMode(false)
  }, [])

  /** Relit depuis localStorage */
  const refresh = useCallback(() => {
    const data = readDossiers()
    setDossiers(data ?? DEMO_DOSSIERS)
    setIsDemoMode(!data)
  }, [])

  return {
    dossiers,
    isDemoMode,
    saveDossiers,
    updateDossier,
    addDossier,
    refresh,
    generateIdDossier: (d) => generateIdDossier(d),
    generateRefDevis:  (d) => generateRefDevis(d),
  }
}
