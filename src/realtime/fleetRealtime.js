import { getSupabaseClient } from '../integrations/supabase/supabaseClient.js';

const DEFAULT_DEBOUNCE_MS = 300;

function isEnabled() {
  if (typeof import.meta !== 'undefined') {
    const value = import.meta?.env?.VITE_ENABLE_FLEETOS_REALTIME;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
  }

  if (typeof window !== 'undefined' && window.__FLEETOS_ENABLE_REALTIME__ === false) {
    return false;
  }

  return true;
}

function createDebouncedEmitter(onEmit, debounceMs) {
  let timer = null;
  let queue = new Set();

  return {
    push(topic) {
      queue.add(topic);
      if (timer) {
        return;
      }

      timer = setTimeout(() => {
        const topics = Array.from(queue);
        queue.clear();
        timer = null;
        onEmit(topics);
      }, debounceMs);
    },
    clear() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = null;
      queue.clear();
    },
  };
}

function isRelevantNetworkEvent(payload, activeAgencyId) {
  const record = payload?.new ?? payload?.old ?? {};
  return record?.producer_agency_id === activeAgencyId || record?.consumer_agency_id === activeAgencyId;
}

function isRelevantSlotRequestEvent(payload, activeAgencyId) {
  const record = payload?.new ?? payload?.old ?? {};
  return record?.requester_agency_id === activeAgencyId || record?.target_agency_id === activeAgencyId;
}

export function createFleetRealtimeManager({
  activeAgencyId,
  onPlanningChange,
  onSharedFeedChange,
  onSlotRequestsChange,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}) {
  const client = getSupabaseClient();

  if (!client || !activeAgencyId || !isEnabled()) {
    return {
      enabled: false,
      start: () => () => {},
      stop: () => {},
    };
  }

  const channels = [];
  const emitter = createDebouncedEmitter((topics) => {
    if (topics.includes('planning')) {
      onPlanningChange?.();
    }
    if (topics.includes('shared_feed')) {
      onSharedFeedChange?.();
    }
    if (topics.includes('slot_requests')) {
      onSlotRequestsChange?.();
    }
  }, debounceMs);

  function start() {
    const planningChannel = client
      .channel(`fleetos:planning:${activeAgencyId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'missions', filter: `agency_id=eq.${activeAgencyId}` }, () => {
        emitter.push('planning');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournees', filter: `agency_id=eq.${activeAgencyId}` }, () => {
        emitter.push('planning');
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournee_missions', filter: `agency_id=eq.${activeAgencyId}` },
        () => {
          emitter.push('planning');
        },
      )
      .subscribe();

    const networkChannel = client
      .channel(`fleetos:shared-feed:${activeAgencyId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shared_tournee_feed' }, (payload) => {
        if (isRelevantNetworkEvent(payload, activeAgencyId)) {
          emitter.push('shared_feed');
        }
      })
      .subscribe();

    const slotRequestsChannel = client
      .channel(`fleetos:slot-requests:${activeAgencyId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'interagency_slot_requests' }, (payload) => {
        if (isRelevantSlotRequestEvent(payload, activeAgencyId)) {
          emitter.push('slot_requests');
        }
      })
      .subscribe();

    channels.push(planningChannel, networkChannel, slotRequestsChannel);

    return stop;
  }

  function stop() {
    emitter.clear();
    for (const channel of channels) {
      client.removeChannel(channel);
    }
    channels.length = 0;
  }

  return {
    enabled: true,
    start,
    stop,
  };
}

export const __private__ = {
  isRelevantNetworkEvent,
  isRelevantSlotRequestEvent,
};
