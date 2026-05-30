import { readJson } from '../platform/browserStorage.js';
import { getSupabaseClient } from '../integrations/supabase/supabaseClient.js';

const LEGACY_CONTEXT_KEY = 'fleetos_user_context';

export async function loadUserContext(session) {
  const userId = session?.user?.id;

  if (!userId) {
    return {
      source: 'no-session',
      profile: null,
      memberships: [],
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return getLegacyFallback('supabase-unavailable');
  }

  const [profileResult, membershipsResult] = await Promise.all([loadProfile(client, userId), loadMemberships(client, userId)]);

  if (profileResult.error || membershipsResult.error) {
    console.error('[FleetOS] Erreur chargement profile/memberships.', {
      profileError: profileResult.error?.message,
      membershipsError: membershipsResult.error?.message,
    });

    return getLegacyFallback('supabase-error');
  }

  return {
    source: 'supabase',
    profile: profileResult.profile,
    memberships: membershipsResult.memberships,
  };
}

export async function loadProfile(client, userId) {
  const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle();
  return {
    profile: data ?? null,
    error: error ?? null,
  };
}

export async function loadMemberships(client, userId) {
  const { data, error } = await client
    .from('memberships')
    .select('agency_id, role, status')
    .eq('user_id', userId)
    .eq('status', 'active');

  return {
    memberships: Array.isArray(data) ? data : [],
    error: error ?? null,
  };
}

function getLegacyFallback(source) {
  const isEnabled = isLegacyFallbackEnabled();
  if (!isEnabled) {
    return {
      source,
      profile: null,
      memberships: [],
    };
  }

  try {
    const parsed = readJson(LEGACY_CONTEXT_KEY, null);

    return {
      source: 'legacy-fallback',
      profile: parsed?.profile ?? null,
      memberships: Array.isArray(parsed?.memberships) ? parsed.memberships : [],
    };
  } catch (_error) {
    return {
      source: 'legacy-fallback',
      profile: null,
      memberships: [],
    };
  }
}

function isLegacyFallbackEnabled() {
  const envValue =
    typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_ENABLE_LEGACY_CONTEXT_FALLBACK : undefined;

  if (typeof envValue === 'string') {
    return envValue.toLowerCase() === 'true';
  }

  if (typeof window !== 'undefined' && window.__FLEETOS_ENABLE_LEGACY_CONTEXT_FALLBACK__ === false) {
    return false;
  }

  return true;
}
