import { getCurrentSession, onSessionChange } from '../auth/sessionService.js';
import { loadUserContext } from '../auth/userContextService.js';
import { computeUiPermissions } from '../auth/permissions.js';
import {
  clearStoredCurrentAgencyId,
  getStoredCurrentAgencyId,
  resolveActiveAgencyId,
} from '../auth/activeAgencyService.js';
import { setCurrentAgency } from '../auth/currentAgencyService.js';

/**
 * Bridge d'intégration pour UI existante.
 * Expose window.FleetOSAuth et remplace le faux login local.
 */
export async function bootstrapAuthContext() {
  const current = await buildContext();
  publishContext(current);

  const unsubscribe = onSessionChange(async () => {
    const next = await buildContext();
    publishContext(next);
  });

  return {
    getContext: () => window.FleetOSAuth,
    setActiveAgency: async (agencyId) => {
      const ctx = window.FleetOSAuth;
      const userId = ctx?.session?.user?.id;

      const result = await setCurrentAgency({
        userId,
        agencyId,
        memberships: ctx?.memberships ?? [],
      });

      const next = {
        ...ctx,
        activeAgencyId: agencyId,
        profile: {
          ...(ctx?.profile ?? {}),
          current_agency_id: agencyId,
        },
        permissions: computeUiPermissions(ctx?.memberships ?? [], agencyId),
      };

      publishContext(next);

      window.dispatchEvent(
        new CustomEvent('fleetos:active-agency-changed', {
          detail: { agencyId, result },
        }),
      );

      return result;
    },
    unsubscribe,
  };
}

async function buildContext() {
  const sessionState = await getCurrentSession();
  const session = sessionState.session;

  if (!session) {
    clearStoredCurrentAgencyId();
    return {
      source: sessionState.source,
      session: null,
      profile: null,
      memberships: [],
      activeAgencyId: null,
      permissions: computeUiPermissions([], null),
    };
  }

  const userContext = await loadUserContext(session);
  const activeAgencyId = resolveActiveAgencyId({
    memberships: userContext.memberships,
    profileCurrentAgencyId: userContext.profile?.current_agency_id,
    preferredAgencyId: getStoredCurrentAgencyId(),
  });

  return {
    source: sessionState.source,
    session,
    profile: userContext.profile,
    memberships: userContext.memberships,
    activeAgencyId,
    permissions: computeUiPermissions(userContext.memberships, activeAgencyId),
  };
}

function publishContext(ctx) {
  window.FleetOSAuth = ctx;
  window.dispatchEvent(new CustomEvent('fleetos:auth-context-ready', { detail: ctx }));
}
