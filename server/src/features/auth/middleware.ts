import { auth } from 'express-oauth2-jwt-bearer';
import type { Request, Response, NextFunction } from 'express';

function resolveIssuerBaseURL(): string {
  const explicit = process.env.AUTH0_ISSUER_BASE_URL?.trim();
  if (explicit) {
    return explicit.endsWith('/') ? explicit : `${explicit}/`;
  }
  const domain = process.env.AUTH0_DOMAIN?.trim();
  if (domain) {
    const host = domain.startsWith('https://') ? domain : `https://${domain}`;
    return host.endsWith('/') ? host : `${host}/`;
  }
  throw new Error(
    'Missing Auth0 issuer: set AUTH0_ISSUER_BASE_URL or AUTH0_DOMAIN in server/.env'
  );
}

/** Validates JWT via Auth0 issuer + audience from env. */
export const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: resolveIssuerBaseURL(),
  tokenSigningAlg: 'RS256',
});

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }
  requireAuth(req, res, (err) => {
    if (err) {
      next();
      return;
    }
    next();
  });
};

export function authSubject(req: Request): string | null {
  return req.auth?.payload?.sub ?? null;
}
