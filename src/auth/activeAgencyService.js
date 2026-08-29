import { readString, removeKey, writeString } from '../platform/browserStorage.js';

const CURRENT_AGENCY_STORAGE_KEY = 'fleetos_current_agency_id';

export function resolveActiveAgencyId({ memberships, profileCurrentAgencyId, preferredAgencyId }) {
  const safeMemberships = Array.isArray(memberships) ? memberships : [];
  if (safeMemberships.length === 0) {
    return null;
  }

  const allowed = new Set(
    safeMemberships
      .filter((membership) => membership?.status === 'active')
      .map((membership) => membership?.agency_id)
      .filter(Boolean),
  );

  const candidates = [profileCurrentAgencyId, preferredAgencyId, getStoredCurrentAgencyId(), safeMemberships[0]?.agency_id];

  for (const candidate of candidates) {
    if (candidate && allowed.has(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function isAgencyAllowed({ agencyId, memberships }) {
  if (!agencyId || !Array.isArray(memberships)) {
    return false;
  }

  return memberships.some((membership) => membership?.status === 'active' && membership?.agency_id === agencyId);
}

export function persistCurrentAgencyId(agencyId) {
  if (!agencyId || typeof agencyId !== 'string') {
    return;
  }

  writeString(CURRENT_AGENCY_STORAGE_KEY, agencyId);
}

export function getStoredCurrentAgencyId() {
  return readString(CURRENT_AGENCY_STORAGE_KEY);
}

export function clearStoredCurrentAgencyId() {
  removeKey(CURRENT_AGENCY_STORAGE_KEY);
}
