import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAccess } from '../../hooks/useAdminAccess';

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin, loading } = useAdminAccess();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-600">Memeriksa akses admin...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;

