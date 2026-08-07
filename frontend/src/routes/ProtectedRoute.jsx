import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D3968C] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#6E6A67]">
            Authenticating Session…
          </span>
        </div>
      </div>
    );
  }

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
