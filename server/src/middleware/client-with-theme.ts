import { readFileSync } from 'fs';
import { join } from 'path';

import express, { type Express, type Request, type Response } from 'express';

import { loadRepoModule, REPO_ROOT } from '../theme/load-repo-module';
import { resolvedThemeCssForRequest } from '../theme/resolved-theme-css';

const CLIENT_DIST = join(REPO_ROOT, 'client/dist');

/** Production: serve SPA assets and inject resolved theme vars into index.html. */
export function mountClientWithTheme(app: Express): void {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }
    express.static(CLIENT_DIST, { index: false })(req, res, next);
  });

  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    try {
      const { injectThemeIntoHtml } = loadRepoModule<{
        injectThemeIntoHtml: (html: string, css: string) => string;
      }>('theme/inject-theme-html');
      const css = resolvedThemeCssForRequest(req);
      const template = readFileSync(join(CLIENT_DIST, 'index.html'), 'utf8');
      res.type('html').send(injectThemeIntoHtml(template, css));
    } catch (error) {
      next(error);
    }
  });
}
