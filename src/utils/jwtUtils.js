/**
 * Utility for parsing JWT tokens and extracting user roles & claims
 */

export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT payload', e);
    return null;
  }
};

export const extractRoleFromToken = (token) => {
  const payload = parseJwt(token);
  if (!payload) return null;

  // Check possible role fields in Spring Security JWT
  if (payload.role) {
    return cleanRole(payload.role);
  }
  if (payload.roles && Array.isArray(payload.roles) && payload.roles.length > 0) {
    return cleanRole(payload.roles[0]);
  }
  if (payload.authorities && Array.isArray(payload.authorities) && payload.authorities.length > 0) {
    const auth = payload.authorities[0];
    return cleanRole(typeof auth === 'string' ? auth : auth.authority);
  }
  if (payload.scope) {
    const scopes = payload.scope.split(' ');
    if (scopes.length > 0) return cleanRole(scopes[0]);
  }

  return null;
};

const cleanRole = (roleStr) => {
  if (!roleStr) return null;
  // Remove ROLE_ prefix if present
  let role = String(roleStr).toUpperCase().replace(/^ROLE_/, '');
  if (['ADMIN', 'DEALER', 'BENEFICIARY'].includes(role)) {
    return role;
  }
  return role;
};

export const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};
