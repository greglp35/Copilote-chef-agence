const usageStats = new Map();

function hasStorage() {
  return typeof localStorage !== 'undefined';
}

function track(key, operation) {
  const current = usageStats.get(key) ?? { reads: 0, writes: 0, removes: 0 };
  if (operation === 'read') {
    current.reads += 1;
  }
  if (operation === 'write') {
    current.writes += 1;
  }
  if (operation === 'remove') {
    current.removes += 1;
  }
  usageStats.set(key, current);
}

export function readString(key) {
  if (!hasStorage()) {
    return null;
  }

  track(key, 'read');
  return localStorage.getItem(key);
}

export function writeString(key, value) {
  if (!hasStorage()) {
    return;
  }

  track(key, 'write');
  localStorage.setItem(key, value);
}

export function removeKey(key) {
  if (!hasStorage()) {
    return;
  }

  track(key, 'remove');
  localStorage.removeItem(key);
}

export function readJson(key, fallbackValue) {
  const raw = readString(key);
  if (!raw) {
    return fallbackValue;
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return fallbackValue;
  }
}

export function writeJson(key, value) {
  writeString(key, JSON.stringify(value));
}

export function getStorageUsageStats() {
  return Object.fromEntries(usageStats.entries());
}

export const __private__ = {
  hasStorage,
  usageStats,
};
