import { auth } from 'express-oauth2-jwt-bearer';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

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

let jwtValidator: RequestHandler | undefined;

function getJwtValidator(): RequestHandler {
  if (!jwtValidator) {
    jwtValidator = auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: resolveIssuerBaseURL(),
      tokenSigningAlg: 'RS256',
    });
  }
  return jwtValidator;
}

/** Validates JWT via Auth0 issuer + audience from env (lazy — no env read at import). */
export const requireAuth: RequestHandler = (req, res, next) =>
  getJwtValidator()(req, res, next);

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
