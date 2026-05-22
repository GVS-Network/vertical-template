import { useAuth0 } from '@auth0/auth0-react';
import Layout from './components/Layout';
import Loading from './components/Loading';
import { useApiAuth } from './hooks/useApiAuth';
import { AppRoutes } from './features/registry';

function App() {
  const { isLoading } = useAuth0();

  useApiAuth();

  return (
    <Layout>
      {isLoading ? <Loading /> : <AppRoutes />}
    </Layout>
  );
}

export default App;
