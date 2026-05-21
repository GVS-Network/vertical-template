import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Loading from './components/Loading';
import { useApiAuth } from './hooks/useApiAuth';

function App() {
  const { isLoading } = useAuth0();

  useApiAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
}

export default App;
