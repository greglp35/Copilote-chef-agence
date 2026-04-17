import { assertAgencyContext } from '../security/agencyGuards.js';
import { createAgencyCrudRepository } from '../supabase/createAgencyCrudRepository.js';

const baseRepo = createAgencyCrudRepository({
  table: 'tournee_missions',
  selectColumns: 'id, agency_id, tournee_id, mission_id, position, created_at, updated_at',
});

export const tourneeMissionsRepository = {
  ...baseRepo,
  async list({ activeAgencyId, memberships, tourneeId, ...options }) {
    assertAgencyContext({ activeAgencyId, memberships });
    const rows = await baseRepo.listByAgency({ activeAgencyId, ...options });
    return tourneeId ? rows.filter((row) => row.tournee_id === tourneeId) : rows;
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
