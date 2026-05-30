import { getSupabaseClient } from '../integrations/supabase/supabaseClient.js';
import { isAgencyAllowed, persistCurrentAgencyId } from './activeAgencyService.js';

export async function setCurrentAgency({ userId, agencyId, memberships }) {
  if (!agencyId || !userId) {
    throw new Error('[FleetOS] userId et agencyId sont requis.');
  }

  if (!isAgencyAllowed({ agencyId, memberships })) {
    throw new Error('[FleetOS] Agence non autorisée pour cet utilisateur.');
  }

  persistCurrentAgencyId(agencyId);

  const client = getSupabaseClient();
  if (!client) {
    return {
      source: 'supabase-unavailable',
      currentAgencyId: agencyId,
    };
  }

  const { error } = await client.from('profiles').update({ current_agency_id: agencyId }).eq('id', userId);

  if (error) {
    console.error('[FleetOS] Impossible de persister current_agency_id.', error.message);
    return {
      source: 'local-only',
      currentAgencyId: agencyId,
      error,
    };
  }

  return {
    source: 'supabase',
    currentAgencyId: agencyId,
  };
}
