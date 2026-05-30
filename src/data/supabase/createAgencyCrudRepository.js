import { getSupabaseClient } from '../../integrations/supabase/supabaseClient.js';
import { buildAgencyFilter } from '../security/agencyGuards.js';
import { normalizeDataAccessError } from '../security/rls.js';

function requireClient() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('[FleetOS] Supabase client indisponible.');
  }
  return client;
}

function withErrorContext(table, operation) {
  return { table, operation };
}

export function createAgencyCrudRepository({ table, selectColumns = '*' }) {
  if (!table) {
    throw new Error('[FleetOS] table requis.');
  }

  async function listByAgency({ activeAgencyId, page = 1, pageSize = 50, orderBy = 'created_at', ascending = false }) {
    const client = requireClient();
    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + Math.max(1, pageSize) - 1;

    const { data, error } = await client
      .from(table)
      .select(selectColumns, { count: 'exact' })
      .match(buildAgencyFilter({ activeAgencyId }))
      .order(orderBy, { ascending })
      .range(from, to);

    if (error) {
      throw normalizeDataAccessError(error, withErrorContext(table, 'listByAgency'));
    }

    return data ?? [];
  }

  async function getById({ id, activeAgencyId }) {
    const client = requireClient();

    const { data, error } = await client
      .from(table)
      .select(selectColumns)
      .eq('id', id)
      .match(buildAgencyFilter({ activeAgencyId }))
      .maybeSingle();

    if (error) {
      throw normalizeDataAccessError(error, withErrorContext(table, 'getById'));
    }

    return data;
  }

  async function createOne({ payload, activeAgencyId }) {
    const client = requireClient();

    const { data, error } = await client
      .from(table)
      .insert({ ...payload, agency_id: activeAgencyId })
      .select(selectColumns)
      .maybeSingle();

    if (error) {
      throw normalizeDataAccessError(error, withErrorContext(table, 'createOne'));
    }

    return data;
  }

  async function updateOne({ id, payload, activeAgencyId }) {
    const client = requireClient();

    const { data, error } = await client
      .from(table)
      .update(payload)
      .eq('id', id)
      .match(buildAgencyFilter({ activeAgencyId }))
      .select(selectColumns)
      .maybeSingle();

    if (error) {
      throw normalizeDataAccessError(error, withErrorContext(table, 'updateOne'));
    }

    return data;
  }

  async function deleteOne({ id, activeAgencyId }) {
    const client = requireClient();

    const { error } = await client
      .from(table)
      .delete()
      .eq('id', id)
      .match(buildAgencyFilter({ activeAgencyId }));

    if (error) {
      throw normalizeDataAccessError(error, withErrorContext(table, 'deleteOne'));
    }

    return { success: true };
  }

  function realtimeChannelName(activeAgencyId) {
    return `realtime:${table}:agency:${activeAgencyId}`;
  }

  return {
    table,
    listByAgency,
    getById,
    createOne,
    updateOne,
    deleteOne,
    realtimeChannelName,
  };
}
