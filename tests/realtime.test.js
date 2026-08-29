import test from 'node:test';
import assert from 'node:assert/strict';

import { __private__ } from '../src/realtime/fleetRealtime.js';

test('isRelevantNetworkEvent détecte les événements liés à l\'agence active', () => {
  const matchProducer = __private__.isRelevantNetworkEvent(
    { new: { producer_agency_id: 'a1', consumer_agency_id: 'a2' } },
    'a1',
  );

  const noMatch = __private__.isRelevantNetworkEvent(
    { new: { producer_agency_id: 'a3', consumer_agency_id: 'a2' } },
    'a1',
  );

  assert.equal(matchProducer, true);
  assert.equal(noMatch, false);
});

test('isRelevantSlotRequestEvent détecte requester/target', () => {
  const matchTarget = __private__.isRelevantSlotRequestEvent(
    { new: { requester_agency_id: 'a3', target_agency_id: 'a1' } },
    'a1',
  );

  const noMatch = __private__.isRelevantSlotRequestEvent(
    { new: { requester_agency_id: 'a3', target_agency_id: 'a2' } },
    'a1',
  );

  assert.equal(matchTarget, true);
  assert.equal(noMatch, false);
});
