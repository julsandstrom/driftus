import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import type { ReactElement } from "react";

type Props = {
  children: ReactElement;
};

const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
