import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import FormPage from './components/FormPage';

/** Route elements for <Routes> — call as intakeRouteElements(), not <IntakeRoutes />. */
export function intakeRouteElements(): ReactNode {
  return <Route path="/forms/:slug" element={<FormPage />} />;
}
