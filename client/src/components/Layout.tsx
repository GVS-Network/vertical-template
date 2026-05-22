import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useSiteConfig } from '../contexts/SiteConfigContext';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { config } = useSiteConfig();

  return (
    <div className="shell-layout">
      <Navbar />
      <main className="shell-main">{children}</main>
      <footer className="shell-footer">
        <div className="shell-footer__text">
          <p>
            &copy; {new Date().getFullYear()} {config.branding.name}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
