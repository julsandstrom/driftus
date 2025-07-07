import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import type { ReactElement } from "react";

type Props = {
  children: ReactElement;
};

const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
