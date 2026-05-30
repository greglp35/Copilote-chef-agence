import test from 'node:test';
import assert from 'node:assert/strict';

import { SHARE_LEVELS, sanitizeSharedTourneeRow } from '../src/data/network/shareLevels.js';
import { renderNetworkAvailabilityPanel } from '../src/ui/panels/networkAvailabilityPanel.js';

test('sanitizeSharedTourneeRow limite les champs en availability_only', () => {
  const row = {
    id: '1',
    producer_agency_id: 'a1',
    consumer_agency_id: 'a2',
    tournee_id: 't1',
    share_scope: SHARE_LEVELS.DISPATCH_COLLABORATION,
    visible_slots: ['08:00'],
    schedule_summary: 'Matin',
    dispatch_notes: 'info interne',
  };

  const sanitized = sanitizeSharedTourneeRow(row, SHARE_LEVELS.AVAILABILITY_ONLY);

  assert.deepEqual(Object.keys(sanitized).sort(), [
    'consumer_agency_id',
    'id',
    'producer_agency_id',
    'published_at',
    'share_scope',
    'shared_status',
    'tournee_id',
    'visible_slots',
  ]);
});

test('sanitizeSharedTourneeRow bloque un niveau non autorisé', () => {
  const row = {
    id: '1',
    share_scope: SHARE_LEVELS.AVAILABILITY_ONLY,
  };

  const sanitized = sanitizeSharedTourneeRow(row, SHARE_LEVELS.SCHEDULE_SUMMARY);
  assert.equal(sanitized, null);
});

test('renderNetworkAvailabilityPanel affiche un panneau lisible', () => {
  const html = renderNetworkAvailabilityPanel([
    { tournee_id: 'T-42', producer_agency_id: 'agency-a', share_scope: SHARE_LEVELS.AVAILABILITY_ONLY },
  ]);

  assert.match(html, /Disponibilités réseau/);
  assert.match(html, /Tournée #T-42/);
});
