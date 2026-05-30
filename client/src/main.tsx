import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { Auth0ProviderWithNavigate } from './features/auth/components/Auth0ProviderWithNavigate';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <SiteConfigProvider>
          <App />
        </SiteConfigProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
