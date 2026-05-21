/**
 * @deprecated Import from `@/features/auth` — kept for backward compatibility.
 */
export {
  requireAuth,
  requireAuth as checkJwt,
  optionalAuth,
  authSubject,
  authSubject as extractUserId,
} from '../features/auth/middleware';

export type AuthRequest = import('express').Request;
