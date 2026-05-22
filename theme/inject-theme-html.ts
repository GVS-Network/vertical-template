/** Inject resolved theme CSS into HTML `<head>` before other stylesheets. */
export function injectThemeIntoHtml(html: string, css: string): string {
  const styleTag = `<style id="resolved-theme">\n${css}\n</style>`;

  if (html.includes('<!-- theme-vars -->')) {
    return html.replace('<!-- theme-vars -->', styleTag);
  }

  return html.replace('<head>', `<head>\n    ${styleTag}`);
}
