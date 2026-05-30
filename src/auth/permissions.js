const ROLE_PRIORITY = ['viewer', 'operator', 'manager', 'admin', 'owner'];

export function computeUiPermissions(memberships, activeAgencyId) {
  const membership = findAgencyMembership(memberships, activeAgencyId);
  const role = membership?.role ?? null;

  return {
    role,
    canReadAgencyData: hasRole(role, 'viewer'),
    canCreateOperations: hasRole(role, 'operator'),
    canManageAgency: hasRole(role, 'manager'),
    canAdministerUsers: hasRole(role, 'admin'),
    isOwner: hasRole(role, 'owner'),
  };
}

export function hasRole(role, minimumRole) {
  const roleIndex = ROLE_PRIORITY.indexOf(role);
  const minimumRoleIndex = ROLE_PRIORITY.indexOf(minimumRole);

  if (roleIndex === -1 || minimumRoleIndex === -1) {
    return false;
  }

  return roleIndex >= minimumRoleIndex;
}

export function can(permissions, permissionKey) {
  if (!permissions || typeof permissions !== 'object') {
    return false;
  }

  return Boolean(permissions[permissionKey]);
}

function findAgencyMembership(memberships, activeAgencyId) {
  if (!Array.isArray(memberships) || !activeAgencyId) {
    return null;
  }

  return memberships.find((membership) => membership.agency_id === activeAgencyId && membership.status === 'active') ?? null;
}
