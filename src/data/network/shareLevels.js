export const SHARE_LEVELS = {
  AVAILABILITY_ONLY: 'availability_only',
  SCHEDULE_SUMMARY: 'schedule_summary',
  DISPATCH_COLLABORATION: 'dispatch_collaboration',
};

const DEFAULT_SHARE_LEVEL = SHARE_LEVELS.AVAILABILITY_ONLY;

const ORDER = [
  SHARE_LEVELS.AVAILABILITY_ONLY,
  SHARE_LEVELS.SCHEDULE_SUMMARY,
  SHARE_LEVELS.DISPATCH_COLLABORATION,
];

export function normalizeShareLevel(value) {
  return ORDER.includes(value) ? value : DEFAULT_SHARE_LEVEL;
}

export function canAccessLevel({ grantedLevel, requestedLevel }) {
  const granted = ORDER.indexOf(normalizeShareLevel(grantedLevel));
  const requested = ORDER.indexOf(normalizeShareLevel(requestedLevel));
  return granted >= requested;
}

export function sanitizeSharedTourneeRow(row, requestedLevel = SHARE_LEVELS.AVAILABILITY_ONLY) {
  const shareScope = normalizeShareLevel(row?.share_scope);
  const level = normalizeShareLevel(requestedLevel);

  if (!canAccessLevel({ grantedLevel: shareScope, requestedLevel: level })) {
    return null;
  }

  const base = {
    id: row?.id,
    producer_agency_id: row?.producer_agency_id,
    consumer_agency_id: row?.consumer_agency_id,
    tournee_id: row?.tournee_id,
    share_scope: shareScope,
    shared_status: row?.shared_status,
    published_at: row?.published_at,
  };

  if (level === SHARE_LEVELS.AVAILABILITY_ONLY) {
    return {
      ...base,
      visible_slots: row?.visible_slots ?? [],
    };
  }

  if (level === SHARE_LEVELS.SCHEDULE_SUMMARY) {
    return {
      ...base,
      visible_slots: row?.visible_slots ?? [],
      schedule_summary: row?.schedule_summary ?? null,
    };
  }

  return {
    ...base,
    visible_slots: row?.visible_slots ?? [],
    schedule_summary: row?.schedule_summary ?? null,
    dispatch_notes: row?.dispatch_notes ?? null,
  };
}

export function defaultShareScope() {
  return DEFAULT_SHARE_LEVEL;
}
