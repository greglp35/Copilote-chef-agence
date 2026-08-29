import { getSupabaseClient } from '../../integrations/supabase/supabaseClient.js';
import { assertAgencyContext } from '../security/agencyGuards.js';
import { normalizeDataAccessError } from '../security/rls.js';
import { SHARE_LEVELS, defaultShareScope, sanitizeSharedTourneeRow } from '../network/shareLevels.js';

const TABLE = 'shared_tournee_feed';
const SELECT_COLUMNS =
  'id, producer_agency_id, consumer_agency_id, tournee_id, shared_status, share_scope, visible_slots, schedule_summary, dispatch_notes, published_at';

function requireClient() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('[FleetOS] Supabase client indisponible.');
  }
  return client;
}

export const sharedTourneeFeedRepository = {
  table: TABLE,

  async listVisible({
    activeAgencyId,
    memberships,
    page = 1,
    pageSize = 50,
    requestedLevel = SHARE_LEVELS.AVAILABILITY_ONLY,
  }) {
    assertAgencyContext({ activeAgencyId, memberships });
    const client = requireClient();
    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + Math.max(1, pageSize) - 1;

    const { data, error } = await client
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .or(`consumer_agency_id.eq.${activeAgencyId},producer_agency_id.eq.${activeAgencyId}`)
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw normalizeDataAccessError(error, { table: TABLE, operation: 'listVisible' });
    }

    return (data ?? [])
      .map((row) => sanitizeSharedTourneeRow(row, requestedLevel))
      .filter(Boolean);
  },

  async publishShare({ payload, activeAgencyId, memberships }) {
    assertAgencyContext({ activeAgencyId, memberships });
    const client = requireClient();

    const row = {
      ...payload,
      producer_agency_id: activeAgencyId,
      share_scope: payload?.share_scope ?? defaultShareScope(),
    };

    const { data, error } = await client.from(TABLE).insert(row).select(SELECT_COLUMNS).maybeSingle();

    if (error) {
      throw normalizeDataAccessError(error, { table: TABLE, operation: 'publishShare' });
    }

    return sanitizeSharedTourneeRow(data, row.share_scope);
  },

  async revokeShare({ id, activeAgencyId, memberships }) {
    assertAgencyContext({ activeAgencyId, memberships });
    const client = requireClient();

    const { error } = await client
      .from(TABLE)
      .delete()
      .eq('id', id)
      .eq('producer_agency_id', activeAgencyId);

    if (error) {
      throw normalizeDataAccessError(error, { table: TABLE, operation: 'revokeShare' });
    }

    return { success: true };
  },

  realtimeChannelName(activeAgencyId) {
    return `realtime:${TABLE}:agency:${activeAgencyId}`;
  },
};
