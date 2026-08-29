import { getSupabaseClient } from '../../integrations/supabase/supabaseClient.js';
import { assertAgencyContext } from '../security/agencyGuards.js';
import { normalizeDataAccessError } from '../security/rls.js';

const TABLE = 'interagency_slot_requests';
const SELECT_COLUMNS =
  'id, requester_agency_id, target_agency_id, request_type, mission_id, requested_slot, message, status, idempotency_key, created_at, updated_at';

function requireClient() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('[FleetOS] Supabase client indisponible.');
  }
  return client;
}

function normalizeRequestType(requestType) {
  return requestType === 'help_request' ? 'help_request' : 'slot_request';
}

export const interagencySlotRequestsRepository = {
  table: TABLE,

  async listVisible({ activeAgencyId, memberships, page = 1, pageSize = 50 }) {
    assertAgencyContext({ activeAgencyId, memberships });
    const client = requireClient();
    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + Math.max(1, pageSize) - 1;

    const { data, error } = await client
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .or(`requester_agency_id.eq.${activeAgencyId},target_agency_id.eq.${activeAgencyId}`)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw normalizeDataAccessError(error, { table: TABLE, operation: 'listVisible' });
    }

    return data ?? [];
  },

  async createRequest({ payload, activeAgencyId, memberships }) {
    assertAgencyContext({ activeAgencyId, memberships });
    const client = requireClient();

    const row = {
      ...payload,
      request_type: normalizeRequestType(payload?.request_type),
      status: payload?.status ?? 'pending',
      requester_agency_id: activeAgencyId,
    };

    const { data, error } = await client.from(TABLE).insert(row).select(SELECT_COLUMNS).maybeSingle();
    if (error) {
      throw normalizeDataAccessError(error, { table: TABLE, operation: 'createRequest' });
    }

    return data;
  },

  async askForSupport({
    targetAgencyId,
    missionId,
    requestedSlot,
    message,
    requestType,
    idempotencyKey,
    activeAgencyId,
    memberships,
  }) {
    return this.createRequest({
      activeAgencyId,
      memberships,
      payload: {
        target_agency_id: targetAgencyId,
        mission_id: missionId,
        requested_slot: requestedSlot,
        message,
        request_type: normalizeRequestType(requestType),
        idempotency_key: idempotencyKey,
      },
    });
  },

  async updateRequestStatus({ id, status, activeAgencyId, memberships }) {
    assertAgencyContext({ activeAgencyId, memberships });
    const client = requireClient();

    const { data, error } = await client
      .from(TABLE)
      .update({ status })
      .eq('id', id)
      .eq('target_agency_id', activeAgencyId)
      .select(SELECT_COLUMNS)
      .maybeSingle();

    if (error) {
      throw normalizeDataAccessError(error, { table: TABLE, operation: 'updateRequestStatus' });
    }

    return data;
  },

  async cancelRequest({ id, activeAgencyId, memberships }) {
    assertAgencyContext({ activeAgencyId, memberships });
    const client = requireClient();

    const { error } = await client
      .from(TABLE)
      .delete()
      .eq('id', id)
      .eq('requester_agency_id', activeAgencyId);

    if (error) {
      throw normalizeDataAccessError(error, { table: TABLE, operation: 'cancelRequest' });
    }

    return { success: true };
  },

  realtimeChannelName(activeAgencyId) {
    return `realtime:${TABLE}:agency:${activeAgencyId}`;
  },
};
