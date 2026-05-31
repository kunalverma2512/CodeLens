import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { deleteAccount } from "../services/userService";
import { getGithubConnectUrl } from "../services/authService";

// ── Helpers ──────────────────────────────────────────────────────────────────

const RANK_COLORS = {
  "legendary grandmaster": "text-red-600",
  "international grandmaster": "text-red-500",
  grandmaster: "text-red-400",
  "international master": "text-orange-500",
  master: "text-orange-400",
  "candidate master": "text-purple-600",
  expert: "text-blue-600",
  specialist: "text-cyan-600",
  pupil: "text-green-600",
  newbie: "text-gray-500",
  unrated: "text-gray-400",
};

const rankColor = (rank = "") =>
  RANK_COLORS[(rank || "").toLowerCase()] || "text-black";

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ text }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500 mb-1">
      {text}
    </p>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b-2 border-gray-100 last:border-0">
      <span className="text-xs font-black uppercase tracking-widest text-gray-500">{label}</span>
      <span className="font-black text-sm uppercase tracking-widest">{value || "—"}</span>
    </div>
  );
}

function StatusBadge({ connected }) {
  return connected ? (
    <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em]">
      ● Connected
    </span>
  ) : (
    <span className="px-3 py-1 border-[2px] border-gray-400 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
      ○ Not Connected
    </span>
  );
}

// ── Auth Method Card ──────────────────────────────────────────────────────────

function AuthMethodCard({ user }) {
  const isGitHub = user?.authProvider === "github";
  const isLocal  = user?.authProvider === "local" || !user?.authProvider;

  return (
    <div className="border-[4px] border-black bg-white p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <SectionLabel text="Sign-in Method" />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none">
            Authentication
          </h2>
        </div>
        <StatusBadge connected={true} />
      </div>

      <div className="space-y-1">
        <InfoRow label="Provider"   value={isGitHub ? "GitHub OAuth" : "Email & Password"} />
        <InfoRow label="Name"       value={user?.name} />
        <InfoRow label="Email"      value={user?.email} />
        <InfoRow label="Verified"   value={user?.isVerified ? "Yes" : "Pending"} />
        <InfoRow label="Role"       value={user?.role || "User"} />
      </div>

      {isLocal && (
        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-gray-500 leading-relaxed border-l-[4px] border-black pl-4">
          You signed up with email. Use the GitHub section below to also connect your GitHub account.
        </p>
      )}
      {isGitHub && (
        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-gray-500 leading-relaxed border-l-[4px] border-black pl-4">
          You signed up via GitHub OAuth. Your account is verified and active.
        </p>
      )}
    </div>
  );
}

// ── GitHub Connection Card ────────────────────────────────────────────────────

function GitHubCard({ user }) {
  const ghIdentity   = user?.oauth?.github;
  const isConnected  = !!ghIdentity?.id;
  const ghUsername   = ghIdentity?.username || user?.handles?.github;
  const ghAvatar     = user?.profile?.avatar;
  const [msg, setMsg] = useState("");

  const [connectLoading, setConnectLoading] = useState(false);

  const handleConnect = async () => {
    setConnectLoading(true);
    setMsg("");
    try {
      // IMPORTANT: We call our API first (cookies sent automatically via withCredentials).
      // The server verifies auth via cookie and returns the GitHub OAuth URL as JSON.
      // Then we navigate to it — this avoids the Authorization header problem
      // that caused the old "Access denied. No token provided." error.
      const url = await getGithubConnectUrl("/account-center");
      if (url) {
        window.location.href = url;
      } else {
        setMsg("Could not initiate GitHub connection. Please try again.");
      }
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to connect GitHub. Please try again.");
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = () => {
    setMsg("Disconnect feature coming soon — contact support to unlink.");
  };

  return (
    <div className="border-[4px] border-black bg-white p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <SectionLabel text="Platform Connection" />
          <div className="flex items-center gap-3">
            {/* GitHub SVG icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none">
              GitHub
            </h2>
          </div>
        </div>
        <StatusBadge connected={isConnected} />
      </div>

      {isConnected ? (
        <>
          {/* Connected profile preview */}
          <div className="flex items-center gap-4 mb-6 p-4 border-[3px] border-black bg-gray-50">
            {ghAvatar && (
              <img
                src={ghAvatar}
                alt={ghUsername}
                className="w-14 h-14 border-[3px] border-black object-cover flex-shrink-0"
              />
            )}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">Connected as</p>
              <p className="text-xl font-black uppercase tracking-tighter">@{ghUsername}</p>
              {ghIdentity?.profileUrl && (
                <a
                  href={ghIdentity.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-black uppercase tracking-widest text-black underline underline-offset-4 decoration-[2px] hover:text-gray-600"
                >
                  View GitHub Profile →
                </a>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <InfoRow label="GitHub ID"  value={ghIdentity?.id} />
            <InfoRow label="Username"   value={ghUsername} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/github-intelligence"
              className="px-6 py-4 border-[4px] border-black bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              View GitHub Intelligence
            </Link>
            <button
              onClick={handleDisconnect}
              className="px-6 py-4 border-[3px] border-gray-400 text-gray-500 text-sm font-black uppercase tracking-widest hover:border-black hover:text-black transition-colors"
            >
              Disconnect
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
            Connect your GitHub account to unlock repository analytics, contribution heatmaps, language breakdowns, and AI-driven project insights.
          </p>

          {/* Benefit chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["100+ Data Points", "Repo Analytics", "Commit History", "Language Stats", "Contribution Graph"].map((t) => (
              <span key={t} className="px-3 py-1 border-[2px] border-black text-[10px] font-black uppercase tracking-widest">
                {t}
              </span>
            ))}
          </div>

          <button
            onClick={handleConnect}
            disabled={connectLoading}
            className="w-full sm:w-auto px-8 py-5 border-[4px] border-black bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connectLoading ? (
              <span className="w-[18px] h-[18px] border-[3px] border-white border-t-transparent animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            )}
            {connectLoading ? "Connecting..." : "Connect GitHub Account"}
          </button>
        </>
      )}

      {msg && (
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-gray-600 border-l-[4px] border-black pl-4">
          {msg}
        </p>
      )}
    </div>
  );
}

// ── Codeforces Card ───────────────────────────────────────────────────────────

function CodeforcesCard({ user }) {
  const cfHandle    = user?.handles?.codeforces;
  const isConnected = !!cfHandle;

  return (
    <div className="border-[4px] border-black bg-white p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <SectionLabel text="Platform Connection" />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none">
            Codeforces
          </h2>
        </div>
        <StatusBadge connected={isConnected} />
      </div>

      {isConnected ? (
        <>
          <div className="space-y-1 mb-6">
            <InfoRow label="Handle" value={cfHandle} />
          </div>
          <Link
            to="/codeforces"
            className="inline-block px-6 py-4 border-[4px] border-black bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            View CF Dashboard
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
            Connect your Codeforces handle to unlock rating history, problem analytics, activity heatmap, and AI-backed growth insights.
          </p>
          <Link
            to="/codeforces"
            className="inline-block px-6 py-4 border-[4px] border-black bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Connect Codeforces
          </Link>
        </>
      )}
    </div>
  );
}

// ── Danger Zone ───────────────────────────────────────────────────────────────

function DangerZone({ onLogout }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      onLogout(); // Logs the user out and redirects to login
    } catch (err) {
      alert("Failed to delete account. Please try again later.");
      setLoading(false);
      setConfirm(false);
    }
  };

  return (
    <div className="border-[4px] border-black bg-white p-6 sm:p-8">
      <SectionLabel text="Danger Zone" />
      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none mb-4">
        Account Actions
      </h2>
      <p className="text-sm font-bold uppercase tracking-widest text-gray-600 leading-relaxed mb-6">
        Destructive actions. These cannot be undone.
      </p>
      <div className="flex flex-wrap gap-3">
        {!confirm ? (
          <button
            onClick={() => setConfirm(true)}
            className="px-6 py-4 border-[3px] border-gray-400 text-gray-500 text-sm font-black uppercase tracking-widest hover:border-black hover:text-black transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="w-full border-[4px] border-black bg-black text-white p-6">
            <p className="font-black uppercase tracking-widest text-sm mb-4">
              Are you sure? This will permanently delete all your data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(false)}
                className="px-6 py-3 border-[3px] border-white text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-3 bg-white text-black text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AccountCenterPage() {
  const { user, logout, refreshUser } = useAuth();
  const [searchParams]    = useSearchParams();
  const [banner, setBanner] = useState("");

  // Backend redirects here after GitHub connect: /account-center?githubStatus=connected
  useEffect(() => {
    const status   = searchParams.get("githubStatus");
    const username = searchParams.get("githubUsername");

    if (status === "connected") {
      setBanner(`GitHub account @${username || "connected"} linked successfully!`);
      // Refresh user profile via /auth/me so the card shows the new GitHub identity
      // WITHOUT needing a full page refresh
      refreshUser().catch(() => {});
      // Clean URL
      window.history.replaceState({}, "", "/account-center");
    }
  }, [searchParams]);

  return (
    <div className="w-full flex-1 bg-white px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto">

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <header className="mb-12 border-b-[4px] border-black pb-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-500 mb-3">
            Settings & Connections
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
            Account Center
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-600 max-w-2xl leading-relaxed">
            Manage your authentication methods, connected platforms, and account preferences. All connections unlock richer analytics and AI insights.
          </p>
        </header>

        {/* ── Success banner ────────────────────────────────────────── */}
        {banner && (
          <div className="mb-8 border-[4px] border-black bg-black text-white px-6 py-4 flex items-center justify-between gap-4">
            <p className="font-black uppercase tracking-widest text-sm">{banner}</p>
            <button
              onClick={() => setBanner("")}
              className="text-white font-black text-lg leading-none hover:text-gray-300"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── User identity quick-view ─────────────────────────────────── */}
        {user && (
          <div className="flex items-center gap-5 mb-12 p-6 border-[4px] border-black bg-black text-white">
            {user.profile?.avatar ? (
              <img
                src={user.profile.avatar}
                alt={user.name}
                className="w-16 h-16 border-[3px] border-white object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 border-[3px] border-white bg-white text-black flex items-center justify-center font-black text-2xl flex-shrink-0">
                {(user.name || "U")[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Logged in as</p>
              <p className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none">
                {user.name}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                {user.email} · {user.authProvider === "github" ? "GitHub Auth" : "Email Auth"}
              </p>
            </div>
          </div>
        )}

        {/* ── Card Grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AuthMethodCard user={user} />
          <GitHubCard     user={user} />
          <CodeforcesCard user={user} />
          <DangerZone onLogout={logout} />
        </div>

      </div>
    </div>
  );
}
