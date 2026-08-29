import { assertAgencyContext } from '../security/agencyGuards.js';
import { createAgencyCrudRepository } from '../supabase/createAgencyCrudRepository.js';

const baseRepo = createAgencyCrudRepository({
  table: 'tournees',
  selectColumns: 'id, agency_id, name, tournee_date, status, created_at, updated_at',
});

export const tourneesRepository = {
  ...baseRepo,
  async list({ activeAgencyId, memberships, ...options }) {
    assertAgencyContext({ activeAgencyId, memberships });
    return baseRepo.listByAgency({ activeAgencyId, ...options });
  },
  async get({ id, activeAgencyId, memberships }) {
    assertAgencyContext({ activeAgencyId, memberships });
    return baseRepo.getById({ id, activeAgencyId });
  },
  async create({ payload, activeAgencyId, memberships }) {
    assertAgencyContext({ activeAgencyId, memberships });
    return baseRepo.createOne({ payload, activeAgencyId });
  },
  async update({ id, payload, activeAgencyId, memberships }) {
    assertAgencyContext({ activeAgencyId, memberships });
    return baseRepo.updateOne({ id, payload, activeAgencyId });
  },
  async remove({ id, activeAgencyId, memberships }) {
    assertAgencyContext({ activeAgencyId, memberships });
    return baseRepo.deleteOne({ id, activeAgencyId });
  },
};
