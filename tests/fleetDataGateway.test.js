import test from 'node:test';
import assert from 'node:assert/strict';

import { getSupportedEntities, listEntity } from '../src/data/fleetDataGateway.js';
import { filterByAgency } from '../src/data/local/localFleetStore.js';

test('getSupportedEntities expose les 5 entités métier migrées', () => {
  const entities = getSupportedEntities();

  assert.deepEqual(entities, ['missions', 'tournees', 'tournee_missions', 'drivers', 'vehicles']);
});

test('filterByAgency n\'expose que les lignes de l\'agence active', () => {
  const rows = [
    { id: 1, agency_id: 'a1' },
    { id: 2, agency_id: 'a2' },
  ];

  const filtered = filterByAgency(rows, 'a2');
  assert.deepEqual(filtered, [{ id: 2, agency_id: 'a2' }]);
});

test('listEntity rejette une entité non supportée', async () => {
  await assert.rejects(
    () => listEntity({ entity: 'unknown', activeAgencyId: 'a1', memberships: [] }),
    /Entité non supportée/,
  );
});
