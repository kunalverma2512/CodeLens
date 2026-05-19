/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/userService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const readCachedUser = () => {
    try {
      const cachedUser = localStorage.getItem("user");
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  };

  const [user, setUser] = useState(readCachedUser);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          setToken(storedToken);
          const response = await getProfile();
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          setAuthError("");
        } catch (error) {
          if ([401, 403].includes(error?.response?.status)) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
            setAuthError("");
          } else {
            setUser((currentUser) => currentUser || readCachedUser());
            setAuthError("We could not refresh your profile. Your session is preserved and will retry when the connection is stable.");
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setAuthError("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = { user, setUser, token, isAuthenticated, loading, authError, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
