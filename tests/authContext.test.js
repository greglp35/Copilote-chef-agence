import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isAgencyAllowed,
  resolveActiveAgencyId,
} from '../src/auth/activeAgencyService.js';
import { computeUiPermissions, can } from '../src/auth/permissions.js';

test('resolveActiveAgencyId priorise current_agency_id du profile si autorisé', () => {
  const memberships = [
    { agency_id: 'a2', role: 'manager', status: 'active' },
    { agency_id: 'a1', role: 'viewer', status: 'active' },
  ];

  const activeAgencyId = resolveActiveAgencyId({
    memberships,
    profileCurrentAgencyId: 'a1',
    preferredAgencyId: 'a2',
  });

  assert.equal(activeAgencyId, 'a1');
});

test('isAgencyAllowed retourne false hors memberships actifs', () => {
  const allowed = isAgencyAllowed({
    agencyId: 'a2',
    memberships: [{ agency_id: 'a2', status: 'inactive' }],
  });

  assert.equal(allowed, false);
});

test('computeUiPermissions + can exposent des permissions UI cohérentes', () => {
  const permissions = computeUiPermissions([{ agency_id: 'a1', role: 'admin', status: 'active' }], 'a1');

  assert.equal(permissions.canAdministerUsers, true);
  assert.equal(can(permissions, 'canManageAgency'), true);
  assert.equal(can(permissions, 'isOwner'), false);
});
