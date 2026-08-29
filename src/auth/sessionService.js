import { getSupabaseClient } from '../integrations/supabase/supabaseClient.js';

export async function getCurrentSession() {
  const client = getSupabaseClient();

  if (!client) {
    return {
      source: 'supabase-unavailable',
      session: null,
    };
  }

  const { data, error } = await client.auth.getSession();
  if (error) {
    console.error('[FleetOS] Erreur getSession:', error.message);
    return {
      source: 'supabase-error',
      session: null,
      error,
    };
  }

  return {
    source: 'supabase',
    session: data?.session ?? null,
  };
}

export function onSessionChange(callback) {
  const client = getSupabaseClient();
  if (!client) {
    callback({ source: 'supabase-unavailable', session: null });
    return () => {};
  }

  const { data } = client.auth.onAuthStateChange((_event, session) => {
    callback({ source: 'supabase', session: session ?? null });
  });

  return () => {
    data?.subscription?.unsubscribe?.();
  };
}
