import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Return null while auth resolves — prevents spinner flash before page renders
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  
  return children;
};

export default PublicRoute;
