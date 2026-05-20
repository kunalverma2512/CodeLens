import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GuardSkeleton } from "./skeletons/PageSkeletons";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <GuardSkeleton />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  
  return children;
};

export default PublicRoute;
