import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    if (location.pathname.startsWith('/publisher')) {
      return <Navigate to="/publisher/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (location.pathname.startsWith('/publisher')) {
      return <Navigate to="/publisher/login" replace />;
    }
    if (currentUser.role === 'reader') return <Navigate to="/my-shelf" replace />;
    if (currentUser.role === 'author') return <Navigate to="/author/dashboard" replace />;
    if (currentUser.role === 'publisher') return <Navigate to="/publisher" replace />;
  }

  return children;
}
