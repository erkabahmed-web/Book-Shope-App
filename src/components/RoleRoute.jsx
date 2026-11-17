import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { EmptyState, Loading, LinkButton } from './UI.jsx';

export default function RoleRoute({ role, children }) {
  const { session, profile, loading, error } = useAuth();
  const location = useLocation();

  if (loading) return <Loading label="Opening your demo page…" />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (error || !profile || !['customer', 'admin'].includes(profile.role)) {
    return (
      <EmptyState title="This demo profile is unavailable">
        {error || 'Sign in with a demo account to open this page.'}
        <LinkButton to="/">Back to the bookshop</LinkButton>
      </EmptyState>
    );
  }
  if (profile.role !== role) {
    return <Navigate to={profile.role === 'admin' ? '/admin' : '/books'} replace />;
  }
  return children;
}
