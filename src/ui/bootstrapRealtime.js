import { createFleetRealtimeManager } from '../realtime/fleetRealtime.js';

export function bootstrapRealtime({
  getAuthContext,
  refreshPlanning,
  refreshSharedFeed,
  refreshSlotRequests,
}) {
  let managerStop = null;

  function restart() {
    managerStop?.();

    const ctx = getAuthContext?.();
    const activeAgencyId = ctx?.activeAgencyId;

    if (!activeAgencyId) {
      managerStop = null;
      return;
    }

    const manager = createFleetRealtimeManager({
      activeAgencyId,
      onPlanningChange: refreshPlanning,
      onSharedFeedChange: refreshSharedFeed,
      onSlotRequestsChange: refreshSlotRequests,
    });

    managerStop = manager.start();
  }

  const onAuthReady = () => restart();
  const onAgencyChanged = () => restart();

  window.addEventListener('fleetos:auth-context-ready', onAuthReady);
  window.addEventListener('fleetos:active-agency-changed', onAgencyChanged);

  restart();

  return () => {
    managerStop?.();
    window.removeEventListener('fleetos:auth-context-ready', onAuthReady);
    window.removeEventListener('fleetos:active-agency-changed', onAgencyChanged);
  };
}
