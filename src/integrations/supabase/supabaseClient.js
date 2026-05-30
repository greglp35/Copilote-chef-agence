function readEnv(name) {
  if (typeof import.meta !== 'undefined' && import.meta?.env?.[name]) {
    return import.meta.env[name];
  }

  if (typeof window !== 'undefined' && window[`__${name}__`]) {
    return window[`__${name}__`];
  }

  return undefined;
}

const SUPABASE_URL = readEnv('VITE_SUPABASE_URL') ?? readEnv('FLEETOS_SUPABASE_URL');
const SUPABASE_ANON_KEY = readEnv('VITE_SUPABASE_ANON_KEY') ?? readEnv('FLEETOS_SUPABASE_ANON_KEY');

let singletonClient = null;

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`[FleetOS] ${label} est manquant.`);
  }
}

export function createSupabaseBrowserClient(options = {}) {
  const {
    url = SUPABASE_URL,
    anonKey = SUPABASE_ANON_KEY,
    createClientFn = typeof window !== 'undefined' ? window.supabase?.createClient : undefined,
  } = options;

  assertString(url, 'SUPABASE_URL');
  assertString(anonKey, 'SUPABASE_ANON_KEY');

  if (typeof createClientFn !== 'function') {
    throw new Error('[FleetOS] SDK Supabase introuvable (window.supabase.createClient).');
  }

  return createClientFn(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export function getSupabaseClient() {
  if (singletonClient) {
    return singletonClient;
  }

  try {
    singletonClient = createSupabaseBrowserClient();
    return singletonClient;
  } catch (error) {
    console.warn('[FleetOS] Supabase non initialisé, mode dégradé activé.', error.message);
    return null;
  }
}
