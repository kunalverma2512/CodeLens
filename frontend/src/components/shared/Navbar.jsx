import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ─── Mega Menu Data ────────────────────────────────────────────────────────────
const MEGA_MENU_ITEMS = [
  {
    label: "Practice CP",
    desc: "Curated competitive programming problems by topic & difficulty",
    icon: "⌥",
    tag: "HOT",
    to: "/practice",
  },
  {
    label: "AlgoVerse",
    desc: "Master every algorithm with interactive visualizations & explanations",
    icon: "◬",
    tag: "NEW",
    to: "/algoverse",
  },
  {
    label: "Project Ideas",
    desc: "AI-generated project concepts matched to your skill stack",
    icon: "◈",
    tag: null,
    to: null,
  },
  {
    label: "Interview Prep",
    desc: "Structured DSA + system design roadmaps for top-tier placements",
    icon: "⌬",
    tag: null,
    to: null,
  },
  {
    label: "Contest Arsenal",
    desc: "Premium solutions from Codeforces, CodeChef, LeetCode & AtCoder",
    icon: "⚔",
    tag: "PRO",
    to: null,
    submenu: [
      {
        label: "Codeforces",
        desc: "Rated contest solutions with detailed explanations",
        icon: "🔵",
        to: "/contests/codeforces",
      },
      {
        label: "CodeChef",
        desc: "Long & short contest problem breakdowns",
        icon: "🟤",
        to: "/contests/codechef",
      },
      {
        label: "LeetCode",
        desc: "Weekly & biweekly contest editorial solutions",
        icon: "🟡",
        to: "/contests/leetcode",
      },
      {
        label: "AtCoder",
        desc: "ABC, ARC & AGC contest comprehensive guides",
        icon: "⚫",
        to: "/contests/atcoder",
      },
    ],
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMegaOpen, setMobileMegaOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const megaRef = useRef(null);
  const megaTriggerRef = useRef(null);
  const megaLeaveTimer = useRef(null);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mega menu on route change
  useEffect(() => {
    setMegaOpen(false);
    setIsMenuOpen(false);
    setMobileMegaOpen(false);
  }, [location.pathname]);

  // Close mega on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        megaRef.current &&
        !megaRef.current.contains(e.target) &&
        megaTriggerRef.current &&
        !megaTriggerRef.current.contains(e.target)
      ) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setMobileMegaOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    return user.name
      ? user.name.toUpperCase()
      : user.email
      ? user.email.split("@")[0].toUpperCase()
      : "";
  };

  const getUserInitial = () => {
    if (!user) return "";
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  // Hover intent — stay open when moving cursor from trigger to panel
  const handleMegaMouseEnter = () => {
    clearTimeout(megaLeaveTimer.current);
    setMegaOpen(true);
  };

  const handleMegaMouseLeave = () => {
    megaLeaveTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  const isActive = (path) => location.pathname === path;

  const linkCls = (path) =>
    `text-sm font-black uppercase tracking-widest transition-all duration-150 ${
      isActive(path)
        ? "text-black underline underline-offset-8 decoration-4 decoration-black"
        : "text-black hover:underline underline-offset-8 decoration-4 decoration-black"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b-4 border-black">
      {/* ── Main Row ── */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 md:py-4 gap-4">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-black hover:opacity-70 transition-opacity flex-shrink-0"
        >
          CODELENS
        </Link>

        {/* ── Desktop Centre Nav ── */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {isAuthenticated && (
            <Link to="/dashboard" className={linkCls("/dashboard")}>
              Dashboard
            </Link>
          )}
          <Link to="/explore" className={linkCls("/explore")}>
            Explore
          </Link>
          {isAuthenticated && (
            <Link to="/codeforces" className={linkCls("/codeforces")}>
              Codeforces
            </Link>
          )}

          {/* ── Tools Mega Menu Trigger ── */}
          <div
            className="relative"
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleMegaMouseLeave}
          >
            <button
              ref={megaTriggerRef}
              className={`text-sm font-black uppercase tracking-widest text-black flex items-center gap-1 transition-all duration-150 hover:underline underline-offset-8 decoration-4 decoration-black focus:outline-none ${
                megaOpen ? "underline underline-offset-8 decoration-4 decoration-black" : ""
              }`}
              aria-haspopup="true"
              aria-expanded={megaOpen}
            >
              Tools
              <span
                className="inline-block transition-transform duration-200 text-xs"
                style={{ transform: megaOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▾
              </span>
            </button>

            {/* ── Mega Menu Panel ── */}
            <div
              ref={megaRef}
              onMouseEnter={handleMegaMouseEnter}
              onMouseLeave={handleMegaMouseLeave}
              aria-hidden={!megaOpen}
              className={`absolute top-full left-1/2 mt-4 w-[580px] bg-white border-4 border-black z-50 transition-all duration-200 origin-top ${
                megaOpen 
                  ? "opacity-100 translate-y-0 scale-100 visible" 
                  : "opacity-0 -translate-y-2 scale-95 invisible"
              }`}
              style={{ transform: "translateX(-50%)" }}
            >
              {/* Top accent bar */}
              <div className="h-1 w-full bg-black" />

              <div className="p-5">
                <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    AI-Powered Tools — GSSoC '26
                  </p>
                  <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 tracking-widest">
                    v2.0
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-[2px] bg-black border-2 border-black overflow-hidden">
                  {MEGA_MENU_ITEMS.map((item, i) => {
                    const Wrapper = item.to ? Link : "button";
                    const hasSubmenu = item.submenu && item.submenu.length > 0;
                    
                    if (hasSubmenu) {
                      return (
                        <div
                          key={item.label}
                          className="col-span-2 bg-white"
                        >
                          <div className="p-3 bg-black text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.icon}</span>
                              <span className="text-xs font-black uppercase tracking-widest">
                                {item.label}
                              </span>
                            </div>
                            {item.tag && (
                              <span className="text-[8px] font-black tracking-widest border border-white px-1.5 py-0.5">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-[2px] bg-black">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.label}
                                to={subItem.to}
                                onClick={closeMenu}
                                className="group flex flex-col p-3 bg-white hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs group-hover:scale-110 transition-transform">{subItem.icon}</span>
                                  <span className="text-[11px] font-black uppercase tracking-wider group-hover:underline decoration-2">
                                    {subItem.label}
                                  </span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 pl-5 leading-tight">
                                  {subItem.desc}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <Wrapper
                        key={item.label}
                        to={item.to}
                        onClick={closeMenu}
                        className="group flex flex-col p-4 bg-white hover:bg-black hover:text-white transition-all duration-150"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                          <span className="text-xs font-black uppercase tracking-widest">
                            {item.label}
                          </span>
                          {item.tag && (
                            <span className="text-[8px] font-black tracking-widest border-2 border-current px-1.5 py-0.5">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold opacity-60 group-hover:opacity-100 pl-6 leading-relaxed">
                          {item.desc}
                        </p>
                      </Wrapper>
                    );
                  })}
                </div>

                {/* Footer strip */}
                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-400">
                    Next update: June 2026
                  </span>
                  <Link 
                    to="/tools" 
                    onClick={closeMenu}
                    className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 hover:bg-white hover:text-black border-2 border-black transition-colors"
                  >
                    All Tools →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop Right Controls ── */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
          {/* APEX — AI Mentor */}
          <Link
            to="/apex-ai"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors duration-150"
            title="APEX — Advanced Performance Excellence eXecutive. Your AI-powered growth strategist."
          >
            <span className="text-base leading-none">◆</span>
            APEX
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm font-black uppercase tracking-widest text-black hover:underline underline-offset-8 decoration-4 decoration-black"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 bg-black text-white text-sm font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors duration-150"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 border-l-4 border-black pl-4">
                <span className="w-7 h-7 flex items-center justify-center bg-black text-white font-black text-xs flex-shrink-0">
                  {getUserInitial()}
                </span>
                <span className="text-xs font-black uppercase tracking-wide text-black max-w-[90px] truncate">
                  {getUserDisplayName()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-black text-sm font-black uppercase tracking-widest border-4 border-black hover:bg-black hover:text-white transition-colors duration-150"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* ── Mobile Right: VELA + Hamburger ── */}
        <div className="lg:hidden flex items-center gap-3">
          <Link
            to="/vela-ai"
            className="flex items-center gap-1 px-3 py-2 bg-black text-white text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-colors duration-150"
            title="VELA AI"
          >
            <span>✦</span>
            VELA
          </Link>
          <button
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center w-10 h-10 gap-[6px] border-2 border-black focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span
              className={`w-6 h-0.5 bg-black transition-transform duration-200 origin-center ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-black transition-opacity duration-200 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-black transition-transform duration-200 origin-center ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <div className="lg:hidden w-full bg-white border-t-4 border-black">
          <div className="flex flex-col">
            {/* Nav links */}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="px-5 py-4 text-sm font-black uppercase tracking-widest text-black border-b-2 border-black hover:bg-black hover:text-white transition-colors duration-150 flex items-center justify-between"
              >
                Dashboard <span className="opacity-40">→</span>
              </Link>
            )}
            <Link
              to="/explore"
              onClick={closeMenu}
              className="px-5 py-4 text-sm font-black uppercase tracking-widest text-black border-b-2 border-black hover:bg-black hover:text-white transition-colors duration-150 flex items-center justify-between"
            >
              Explore <span className="opacity-40">→</span>
            </Link>
            {isAuthenticated && (
              <Link
                to="/codeforces"
                onClick={closeMenu}
                className="px-5 py-4 text-sm font-black uppercase tracking-widest text-black border-b-2 border-black hover:bg-black hover:text-white transition-colors duration-150 flex items-center justify-between"
              >
                Codeforces <span className="opacity-40">→</span>
              </Link>
            )}

            {/* Tools accordion */}
            <button
              onClick={() => setMobileMegaOpen((v) => !v)}
              className="px-5 py-4 text-sm font-black uppercase tracking-widest text-black border-b-2 border-black hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between w-full text-left"
            >
              <span>Tools</span>
              <span
                className="transition-transform duration-200 text-xs"
                style={{ transform: mobileMegaOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▾
              </span>
            </button>

            {mobileMegaOpen && (
              <div className="border-b-2 border-black bg-gray-50">
                {MEGA_MENU_ITEMS.map((item) => {
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  
                  if (hasSubmenu) {
                    const isExpanded = expandedSubmenu === item.label;
                    return (
                      <div key={item.label} className="border-b border-black/10">
                        <button
                          onClick={() => setExpandedSubmenu(isExpanded ? null : item.label)}
                          className="w-full text-left px-8 py-3 bg-black text-white transition-colors duration-150 group flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black">{item.icon}</span>
                              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                              {item.tag && (
                                <span className="text-[9px] font-black tracking-widest border border-current px-1 leading-tight">
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-bold tracking-wide text-gray-300 mt-0.5 pl-6 leading-snug">
                              {item.desc}
                            </p>
                          </div>
                          <span
                            className="text-white transition-transform duration-200 text-xs ml-2"
                            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                          >
                            ▾
                          </span>
                        </button>
                        {isExpanded && (
                          <div className="bg-white">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.label}
                                to={subItem.to}
                                onClick={closeMenu}
                                className="w-full text-left px-12 py-3 border-b border-black/5 hover:bg-black hover:text-white transition-colors duration-150 group flex items-start gap-2"
                              >
                                <span className="text-sm font-black mt-0.5">{subItem.icon}</span>
                                <div className="flex-1">
                                  <div className="text-xs font-black uppercase tracking-widest">{subItem.label}</div>
                                  <p className="text-[11px] font-bold tracking-wide text-gray-500 group-hover:text-white mt-0.5 leading-snug">
                                    {subItem.desc}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  const Wrapper = item.to ? Link : "button";
                  return (
                    <Wrapper
                      key={item.label}
                      {...(item.to ? { to: item.to } : { type: "button" })} 
                      onClick={closeMenu}
                      className="w-full text-left px-8 py-3 border-b border-black/10 hover:bg-black hover:text-white transition-colors duration-150 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black">{item.icon}</span>
                        <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                        {item.tag && (
                          <span className="text-[9px] font-black tracking-widest border border-current px-1 leading-tight">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold tracking-wide text-gray-500 group-hover:text-white mt-0.5 pl-6 leading-snug">
                        {item.desc}
                      </p>
                    </Wrapper>
                  );
                })}
              </div>
            )}

            {/* Auth section */}
            {!isAuthenticated ? (
              <div className="flex flex-col gap-0">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="px-5 py-4 text-sm font-black uppercase tracking-widest text-black border-b-2 border-black hover:bg-black hover:text-white transition-colors duration-150 flex items-center justify-between"
                >
                  Login <span className="opacity-40">→</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="px-5 py-4 bg-black text-white text-sm font-black uppercase tracking-widest border-b-2 border-black hover:bg-gray-900 transition-colors duration-150 text-center"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-0">
                <div className="px-5 py-4 border-b-2 border-black flex items-center gap-3 bg-gray-50">
                  <span className="w-9 h-9 flex items-center justify-center bg-black text-white font-black text-base flex-shrink-0">
                    {getUserInitial()}
                  </span>
                  <span className="text-sm font-black uppercase tracking-wide text-black">
                    {getUserDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-4 text-sm font-black uppercase tracking-widest text-black border-b-2 border-black hover:bg-black hover:text-white transition-colors duration-150 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
