import { Route } from 'react-router-dom';
import FormPage from './components/FormPage';

export function IntakeRoutes() {
  return <Route path="/forms/:slug" element={<FormPage />} />;
}
