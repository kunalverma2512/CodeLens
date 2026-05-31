/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe, logoutApi } from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  /**
   * isAuthenticated: true only when we have a confirmed user object from the server.
   * We do NOT rely on localStorage or any client-side token — the server's HttpOnly
   * cookie is the single source of truth.
   */
  const isAuthenticated = !!user;

  /**
   * On mount: ask the server "who am I?" using the HttpOnly cookie.
   * A real auth failure clears the user; transient failures preserve current
   * state so temporary API issues do not force a logout.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await getMe();
        setUser(response.data);
        setAuthError("");
      } catch (err) {
        if ([401, 403].includes(err?.response?.status)) {
          setUser(null);
          setAuthError("");
        } else {
          setAuthError("We could not refresh your session. Please retry when the connection is stable.");
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  /**
   * Call this after a successful login/signup/GitHub auth to set user state.
   * No token needed — the server already set the HttpOnly cookie.
   * @param {Object} userData - The full user object from the API response
   */
  const login = useCallback((userData) => {
    setUser(userData);
    setAuthError("");
  }, []);

  /**
   * Logs the user out:
   *  1. Calls POST /api/auth/logout to clear server-side cookies
   *  2. Clears local user state
   * No localStorage to clear.
   */
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Even if the API call fails, clear local state
    } finally {
      setUser(null);
      setAuthError("");
    }
  }, []);

  /**
   * Call this to refresh the user object from the server after profile changes
   * (e.g., after connecting GitHub, updating Codeforces handle, etc.).
   * Only confirmed auth failures clear the current user.
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await getMe();
      setUser(response.data);
      setAuthError("");
      return response.data;
    } catch (err) {
      if ([401, 403].includes(err?.response?.status)) {
        setUser(null);
        setAuthError("");
      } else {
        setAuthError("We could not refresh your session. Please retry when the connection is stable.");
      }
      return null;
    }
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated,
    loading,
    authError,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
