import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Return null while auth resolves — each protected page renders its own skeleton
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

export default ProtectedRoute;
