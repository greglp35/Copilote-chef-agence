import { SHARE_LEVELS } from '../../data/network/shareLevels.js';
import { interagencySlotRequestsRepository } from '../../data/modules/interagencySlotRequestsRepository.js';
import { sharedTourneeFeedRepository } from '../../data/modules/sharedTourneeFeedRepository.js';

export async function loadNetworkAvailability({ activeAgencyId, memberships, requestedLevel = SHARE_LEVELS.AVAILABILITY_ONLY }) {
  return sharedTourneeFeedRepository.listVisible({
    activeAgencyId,
    memberships,
    requestedLevel,
  });
}

export function renderNetworkAvailabilityPanel(rows = []) {
  const items = rows
    .map(
      (row) => `
      <li data-share-scope="${row.share_scope}">
        <strong>Tournée #${row.tournee_id ?? 'N/A'}</strong>
        <p>Agence: ${row.producer_agency_id ?? 'inconnue'} · Niveau: ${row.share_scope}</p>
      </li>`,
    )
    .join('');

  return `
    <section aria-labelledby="network-availability-title">
      <h2 id="network-availability-title">Disponibilités réseau</h2>
      <ul>${items || '<li>Aucune disponibilité partagée.</li>'}</ul>
    </section>
  `;
}

export async function requestNetworkSupport({
  activeAgencyId,
  memberships,
  targetAgencyId,
  missionId,
  requestedSlot,
  message,
  requestType = 'slot_request',
  idempotencyKey,
}) {
  return interagencySlotRequestsRepository.askForSupport({
    activeAgencyId,
    memberships,
    targetAgencyId,
    missionId,
    requestedSlot,
    message,
    requestType,
    idempotencyKey,
  });
}
