import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * GitHubCallbackPage
 *
 * The backend redirects here after GitHub OAuth completes:
 *   Success: /auth/github/callback?authStatus=success&redirectTo=/dashboard
 *   Error:   /login?githubAuthError=...
 *
 * For SUCCESS flow:
 *   - The server has already set HttpOnly auth cookies BEFORE the redirect.
 *   - We call refreshUser() to hydrate the AuthContext from the server (GET /auth/me).
 *   - Then navigate to the intended destination (redirectTo param).
 *
 * For CONNECT flow (linking GitHub to existing account):
 *   - The server redirects to /account-center?githubStatus=connected
 *   - That page handles the success UI (this component is NOT used for connect)
 *
 * For ERROR flow:
 *   - The server redirects to /login?githubAuthError=... (not here)
 *
 * This component handles ONLY the login/signup success path.
 */
export default function GitHubCallbackPage() {
  const navigate                     = useNavigate();
  const [searchParams]               = useSearchParams();
  const { refreshUser }              = useAuth();
  const [status, setStatus]          = useState("processing");
  const [errorMsg, setErrorMsg]      = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const authStatus = searchParams.get("authStatus");
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";

      // Only handle success — errors are redirected to /login by the server
      if (authStatus !== "success") {
        setStatus("error");
        setErrorMsg("Unexpected callback state. Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
        return;
      }

      try {
        // The HttpOnly cookie has already been set by the server.
        // Fetch the full user profile to hydrate the AuthContext.
        const userData = await refreshUser();

        if (!userData) {
          throw new Error("Failed to load user profile after GitHub authentication.");
        }

        // Navigate to intended destination
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setStatus("error");
        setErrorMsg(err?.message || "GitHub authentication could not be completed. Please try again.");
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      }
    };

    handleCallback();
    // searchParams is stable but included in deps to satisfy the exhaustive-deps lint rule
  }, [searchParams, refreshUser, navigate]); // Run once on mount, using stable hooks

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full border-[4px] border-black p-12 text-center shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
        {status === "processing" ? (
          <>
            <div className="w-14 h-14 border-[5px] border-black border-t-transparent animate-spin mx-auto mb-8" />
            <h1 className="text-2xl font-black uppercase tracking-tighter mb-3">
              Authenticating
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">
              Completing GitHub sign-in...
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-6">✕</div>
            <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">
              Authentication Failed
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-6 leading-relaxed">
              {errorMsg}
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">
              Redirecting to login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
