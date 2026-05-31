/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe, logoutApi } from "../services/authService";

const AuthContext = createContext(null);
const AUTH_SESSION_HINT_KEY = "codelens.auth.sessionHint";

const readSessionHint = () => {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(AUTH_SESSION_HINT_KEY) === "true";
};

const writeSessionHint = () => {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(AUTH_SESSION_HINT_KEY, "true");
  }
};

const clearSessionHint = () => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(AUTH_SESSION_HINT_KEY);
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authUnknown, setAuthUnknown] = useState(readSessionHint);

  /**
   * isAuthenticated remains true for a previously confirmed session when the
   * bootstrap profile call hits a transient failure. The server's HttpOnly
   * cookie is still the source of truth; authUnknown only prevents route guards
   * from treating temporary API downtime as a logout.
   */
  const isAuthenticated = !!user || authUnknown;

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
        setAuthUnknown(false);
        setAuthError("");
        writeSessionHint();
      } catch (err) {
        if ([401, 403].includes(err?.response?.status)) {
          setUser(null);
          setAuthUnknown(false);
          setAuthError("");
          clearSessionHint();
        } else {
          setAuthUnknown(readSessionHint());
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
    setAuthUnknown(false);
    setAuthError("");
    writeSessionHint();
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
      setAuthUnknown(false);
      setAuthError("");
      clearSessionHint();
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
      setAuthUnknown(false);
      setAuthError("");
      writeSessionHint();
      return response.data;
    } catch (err) {
      if ([401, 403].includes(err?.response?.status)) {
        setUser(null);
        setAuthUnknown(false);
        setAuthError("");
        clearSessionHint();
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
    authUnknown,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
