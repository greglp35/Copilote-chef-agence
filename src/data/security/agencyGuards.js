export function assertAgencyContext({ activeAgencyId, memberships }) {
  if (!activeAgencyId || typeof activeAgencyId !== 'string') {
    throw new Error('[FleetOS] activeAgencyId requis pour accéder aux données.');
  }

  if (!Array.isArray(memberships) || memberships.length === 0) {
    throw new Error('[FleetOS] memberships requis pour valider le scope agence.');
  }

  const allowed = memberships
    .filter((m) => m?.status === 'active')
    .map((m) => m?.agency_id)
    .filter(Boolean);

  if (!allowed.includes(activeAgencyId)) {
    throw new Error('[FleetOS] activeAgencyId hors périmètre memberships.');
  }

  return true;
}

export function buildAgencyFilter({ activeAgencyId }) {
  return { agency_id: activeAgencyId };
}
