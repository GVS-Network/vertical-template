import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

import { injectThemeIntoHtml } from '../theme/inject-theme-html';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const THEME_CSS_URL =
  process.env.VITE_THEME_API ?? 'http://127.0.0.1:3001/api/_meta/theme.css';

function injectResolvedThemePlugin(): Plugin {
  return {
    name: 'inject-resolved-theme',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        try {
          const response = await fetch(THEME_CSS_URL);
          if (!response.ok) {
            console.warn(
              `[theme-vars] ${THEME_CSS_URL} → HTTP ${response.status}; skipping injection`
            );
            return html;
          }
          const css = await response.text();
          return injectThemeIntoHtml(html, css);
        } catch (error) {
          console.warn(
            '[theme-vars] could not fetch theme CSS — is the API running on :3001?',
            error
          );
          return html;
        }
      },
    },
  };
}

export default defineConfig({
  plugins: [injectResolvedThemePlugin(), react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
