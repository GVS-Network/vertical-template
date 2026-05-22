/** Inject resolved theme CSS into HTML `<head>` before other stylesheets. */
export function injectThemeIntoHtml(html: string, css: string): string {
  const styleTag = `<style id="resolved-theme">\n${css}\n</style>`;

  const linkStub =
    '<link rel="stylesheet" href="/api/_meta/theme.css" id="resolved-theme-link" />';
  if (html.includes(linkStub)) {
    return html.replace(linkStub, styleTag);
  }

  if (html.includes('<!-- theme-vars -->')) {
    return html.replace('<!-- theme-vars -->', styleTag);
  }

  return html.replace('<head>', `<head>\n    ${styleTag}`);
}

/** Dev: stylesheet fetched per page load via Vite /api proxy. */
export const THEME_STYLESHEET_LINK =
  '<link rel="stylesheet" href="/api/_meta/theme.css" id="resolved-theme-link" />';
