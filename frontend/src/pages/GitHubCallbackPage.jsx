import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * GitHubCallbackPage
 *
 * The backend redirects here after OAuth completes:
 *   /login?authStatus=success#token=JWT...
 *   /login?githubAuthError=...
 *
 * This component is mounted on /auth/github/callback (frontend).
 * It extracts the token from the URL hash fragment, saves it, and
 * redirects to the dashboard. On error, it redirects to login with the error.
 */
export default function GitHubCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState("processing"); // processing | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const error = searchParams.get("githubAuthError");
    if (error) {
      setStatus("error");
      setErrorMsg(decodeURIComponent(error));
      setTimeout(() => navigate(`/login?error=${encodeURIComponent(error)}`), 2000);
      return;
    }

    // Token is passed in the hash fragment: #token=JWT&...
    const hash = window.location.hash.slice(1); // strip leading #
    const params = new URLSearchParams(hash);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setErrorMsg("No token received. Please try again.");
      setTimeout(() => navigate("/login"), 2500);
      return;
    }

    // Persist token and bootstrap user
    localStorage.setItem("token", token);

    // Decode name from JWT payload (base64 decode middle segment)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // login() with minimal stub — AuthContext will re-fetch full profile on next load
      login(token, { id: payload.userId, email: payload.email, role: payload.role });
    } catch {
      login(token, {});
    }

    navigate("/dashboard", { replace: true });
  }, []);

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
