import { readJson, writeJson } from '../../platform/browserStorage.js';

const STORAGE_KEYS = {
  missions: 'fleetos_missions',
  tournees: 'fleetos_tournees',
  tournee_missions: 'fleetos_tournee_missions',
  drivers: 'fleetos_drivers',
  vehicles: 'fleetos_vehicles',
};

function isEnabled() {
  if (typeof import.meta !== 'undefined') {
    const value = import.meta?.env?.VITE_ENABLE_LEGACY_BUSINESS_LOCALSTORAGE;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
  }

  if (typeof window !== 'undefined' && window.__FLEETOS_ENABLE_LEGACY_BUSINESS_LOCALSTORAGE__ === false) {
    return false;
  }

  return true;
}

function warnLegacy(entity) {
  console.warn(`[FleetOS] Fallback localStorage utilisé pour ${entity}. À supprimer après migration Supabase.`);
}

export function readLocalEntity(entity) {
  if (!isEnabled()) {
    return [];
  }

  const key = STORAGE_KEYS[entity];
  if (!key) {
    return [];
  }

  warnLegacy(entity);

  try {
    const parsed = readJson(key, []);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

export function writeLocalEntity(entity, rows) {
  if (!isEnabled()) {
    return;
  }

  const key = STORAGE_KEYS[entity];
  if (!key) {
    return;
  }

  warnLegacy(entity);
  writeJson(key, Array.isArray(rows) ? rows : []);
}

export function filterByAgency(rows, activeAgencyId) {
  if (!activeAgencyId) {
    return [];
  }

  return rows.filter((row) => row?.agency_id === activeAgencyId);
}
