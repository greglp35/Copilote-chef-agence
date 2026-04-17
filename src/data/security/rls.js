const RLS_PATTERNS = [
  'row-level security',
  'permission denied',
  'violates row-level security policy',
  '42501',
];

export function isRlsError(error) {
  const message = `${error?.message ?? ''} ${error?.details ?? ''}`.toLowerCase();
  return RLS_PATTERNS.some((pattern) => message.includes(pattern));
}

export function normalizeDataAccessError(error, context = {}) {
  if (!error) {
    return null;
  }

  if (isRlsError(error)) {
    return {
      code: 'RLS_FORBIDDEN',
      message: 'Accès refusé par les règles de sécurité inter-agences.',
      context,
      cause: error,
    };
  }

  return {
    code: error.code ?? 'DATA_ACCESS_ERROR',
    message: error.message ?? 'Erreur d\'accès aux données.',
    context,
    cause: error,
  };
}
