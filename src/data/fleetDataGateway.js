import {
  missionsRepository,
  tourneesRepository,
  tourneeMissionsRepository,
  driversRepository,
  vehiclesRepository,
} from './modules/index.js';
import { filterByAgency, readLocalEntity } from './local/localFleetStore.js';

const MODULES = {
  missions: missionsRepository,
  tournees: tourneesRepository,
  tournee_missions: tourneeMissionsRepository,
  drivers: driversRepository,
  vehicles: vehiclesRepository,
};

export async function listEntity({ entity, activeAgencyId, memberships, page, pageSize, orderBy, ascending }) {
  const repository = MODULES[entity];

  if (!repository) {
    throw new Error(`[FleetOS] Entité non supportée: ${entity}`);
  }

  try {
    return await repository.list({
      activeAgencyId,
      memberships,
      page,
      pageSize,
      orderBy,
      ascending,
    });
  } catch (error) {
    if (error?.code === 'RLS_FORBIDDEN') {
      throw error;
    }

    const localRows = readLocalEntity(entity);
    return filterByAgency(localRows, activeAgencyId);
  }
}

export function getSupportedEntities() {
  return Object.keys(MODULES);
}
