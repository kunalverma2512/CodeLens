import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./loaders/LoaderSwitcher";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

export default ProtectedRoute;
