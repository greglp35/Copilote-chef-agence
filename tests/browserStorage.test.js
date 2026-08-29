import test from 'node:test';
import assert from 'node:assert/strict';

import { __private__, getStorageUsageStats, readJson, readString, removeKey, writeJson, writeString } from '../src/platform/browserStorage.js';

test('browserStorage retourne fallback en environnement sans localStorage', () => {
  assert.equal(__private__.hasStorage(), false);
  assert.equal(readString('x'), null);
  assert.deepEqual(readJson('x', []), []);

  writeString('x', '1');
  writeJson('y', { ok: true });
  removeKey('x');

  assert.deepEqual(getStorageUsageStats(), {});
});
