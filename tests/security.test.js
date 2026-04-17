import test from 'node:test';
import assert from 'node:assert/strict';

import { assertAgencyContext } from '../src/data/security/agencyGuards.js';
import { isRlsError, normalizeDataAccessError } from '../src/data/security/rls.js';

test('assertAgencyContext accepte une agence active présente dans memberships actifs', () => {
  const result = assertAgencyContext({
    activeAgencyId: 'agency-a',
    memberships: [
      { agency_id: 'agency-a', status: 'active' },
      { agency_id: 'agency-b', status: 'inactive' },
    ],
  });

  assert.equal(result, true);
});

test('assertAgencyContext rejette une agence hors périmètre', () => {
  assert.throws(
    () =>
      assertAgencyContext({
        activeAgencyId: 'agency-x',
        memberships: [{ agency_id: 'agency-a', status: 'active' }],
      }),
    /hors périmètre/,
  );
});

test('isRlsError détecte les erreurs RLS PostgreSQL', () => {
  const error = { message: 'new row violates row-level security policy for table missions' };
  assert.equal(isRlsError(error), true);
});

test('normalizeDataAccessError retourne un code métier RLS_FORBIDDEN', () => {
  const normalized = normalizeDataAccessError(
    { message: 'permission denied for table tournees', code: '42501' },
    { table: 'tournees', operation: 'listByAgency' },
  );

  assert.equal(normalized.code, 'RLS_FORBIDDEN');
  assert.equal(normalized.context.table, 'tournees');
});
