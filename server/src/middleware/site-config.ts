import { Request, Response, NextFunction } from 'express';
import { getSiteConfig } from '../seams/get-site-config';

export function attachSiteConfig(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  req.siteConfig = getSiteConfig(req);
  next();
}
