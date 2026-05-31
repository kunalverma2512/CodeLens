import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ─── Mega Menu Data  ───────────────────────────────────────────────
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

// ─── Tag Badge ─────────────────────────────────────────────────────────────────
// Refined: thinner border, tighter tracking, color-coded per type
const TAG_COLORS = {
  HOT: "border-orange-400 text-orange-500",
  NEW: "border-emerald-400 text-emerald-600",
  PRO: "border-zinc-400 text-zinc-500",
};

function Tag({ label }) {
  if (!label) return null;
  return (
    <span
      className={`text-[9px] font-bold tracking-[0.12em] uppercase border px-1.5 py-px leading-tight rounded-[2px] ${
        TAG_COLORS[label] ?? "border-zinc-400 text-zinc-500"
      }`}
    >
      {label}
    </span>
  );
}

// ─── Chevron Icon ──────────────────────────────────────────────────────────────
function Chevron({ open, className = "" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
    >
      <path d="M2 4l4 4 4-4" />
    </svg>
  );
}

// ─── Desktop Mega Menu Panel ───────────────────────────────────────────────────
function MegaMenuPanel({ megaRef, onMouseEnter, onMouseLeave, onClose, megaTriggerRef, firstMenuItemRef, }) {
  return (
    <div
      id="tools-mega-menu"
      role="region"
      aria-label="Tools menu"
      ref={megaRef}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
          setTimeout(() => {
            megaTriggerRef.current?.focus();
          }, 0);
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-1/2 mt-4 w-[620px] bg-white border border-zinc-200 shadow-2xl shadow-black/8 z-50 rounded-sm"
      style={{ transform: "translateX(-50%)" }}
    >
      {/* Single thin top accent — replaces aggressive border-4 */}
      <div className="h-0.5 w-full bg-black rounded-t-sm" />

      <div className="p-5">
        {/* Section label */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-4 pb-3 border-b border-zinc-100">
          AI-Powered Tools — GSSoC '26
        </p>

        {/* Item grid — gap-px with bg-zinc-100 creates razor-thin dividers */}
        <div className="grid grid-cols-2 gap-px bg-zinc-100 rounded-[2px] overflow-hidden">
          {MEGA_MENU_ITEMS.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            // ── Contest Arsenal: full-width with nested submenu ────────────
            if (hasSubmenu) {
              return (
                <div key={item.label} className="col-span-2">
                  {/* Parent header */}
                  <div className="bg-zinc-900 text-white px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm leading-none opacity-70">{item.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-[0.1em]">{item.label}</span>
                      <Tag label={item.tag} />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 pl-5 leading-snug font-normal">
                      {item.desc}
                    </p>
                  </div>
                  {/* Submenu grid */}
                  <div className="grid grid-cols-2 gap-px bg-zinc-100">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        onClick={onClose}
                        className="group bg-white px-4 py-3 hover:bg-zinc-900 hover:text-white transition-colors duration-150"
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm leading-none">{sub.icon}</span>
                          <span className="text-xs font-semibold uppercase tracking-[0.09em] group-hover:text-white">
                            {sub.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 pl-5 leading-snug group-hover:text-zinc-300 font-normal">
                          {sub.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            // ── Standard grid item ─────────────────────────────────────────
            const Wrapper = item.to ? Link : "div";
            const wrapperProps = item.to ? { to: item.to, onClick: onClose } : {};

            return (
              <Wrapper
                ref={item.label === "Practice CP" ? firstMenuItemRef : null}
                key={item.label}
                {...wrapperProps}
                className={`bg-white px-4 py-3 transition-colors duration-150 ${
                  item.to
                    ? "cursor-pointer hover:bg-zinc-900 hover:text-white group"
                    : "cursor-default opacity-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm leading-none opacity-70">{item.icon}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.09em]">{item.label}</span>
                  <Tag label={item.tag} />
                </div>
                <p className="text-[11px] text-zinc-400 pl-5 leading-snug group-hover:text-zinc-300 font-normal">
                  {item.desc}
                </p>
              </Wrapper>
            );
          })}
        </div>

        {/* Footer strip */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
            More tools shipping soon
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-700 underline underline-offset-2 hover:text-black cursor-pointer transition-colors">
            View All →
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen]           = useState(false);
  const [megaOpen, setMegaOpen]               = useState(false);
  const [mobileMegaOpen, setMobileMegaOpen]   = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const [scrolled, setScrolled]               = useState(false);

  const megaRef          = useRef(null);
  const firstMenuItemRef = useRef(null);
  const megaTriggerRef   = useRef(null);
  const hamburgerRef     = useRef(null);
  const megaLeaveTimer   = useRef(null);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Scroll elevation shadow ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mega on outside click ──────────────────────────────────────────
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

  // ── Close mobile menu on route change ───────────────────────────────────
  useEffect(() => {
    setIsMenuOpen(false);
    setMobileMegaOpen(false);
  }, [location.pathname]);

  // ── iOS-safe body scroll lock with scroll position restoration ───────────
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

  // ── Close menu on Escape key, restore focus to hamburger ────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
        setTimeout(() => hamburgerRef.current?.focus(), 0);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    return () => {
      clearTimeout(megaLeaveTimer.current);
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout(); // clears HttpOnly cookies server-side
    navigate("/");
    setIsMenuOpen(false);
  };
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu  = useCallback(() => {
    setIsMenuOpen(false);
    setMobileMegaOpen(false);
    setMegaOpen(false);
  }, []);

  const handleMegaMouseEnter = () => {
    clearTimeout(megaLeaveTimer.current);
    setMegaOpen(true);

    setTimeout(() => {
      firstMenuItemRef.current?.focus();
    }, 0);
  };

  const handleMegaMouseLeave = () => {
    megaLeaveTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  // ── User helpers ─────────────────────────────────────────────────────────
  const getUserDisplayName = () => {
    if (!user) return "";
    return user.name
      ? user.name.toUpperCase()
      : user.email
      ? user.email.split("@")[0].toUpperCase()
      : "";
  };
  const getUserInitial = () => {
    if (!user) return "U";
    if (user.name)  return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  // ── Active link style ────────────────────────────────────────────────────
  // font-semibold + thin underline instead of font-black + decoration-4
  const isActive   = (path) => location.pathname === path;
  const navLinkCls = (path) =>
    `text-[13px] font-semibold uppercase tracking-[0.09em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
      isActive(path)
        ? "text-black underline underline-offset-4 decoration-[1.5px] decoration-black"
        : "text-zinc-500 hover:text-black"
    }`;

  // ── Mobile link row style ────────────────────────────────────────────────
  const mobileLinkCls =
    "px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.09em] text-zinc-600 border-b border-zinc-100 hover:bg-zinc-50 hover:text-black transition-colors duration-150 flex items-center justify-between";

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white border-b border-zinc-200 transition-shadow duration-200 ${
        scrolled ? "shadow-sm shadow-black/5" : ""
      }`}
    >
      {/* ── Main Row ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 gap-4">

        {/* ── Wordmark ──────────────────────────────────────────────────── */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-lg font-black tracking-tighter uppercase text-black hover:opacity-60 transition-opacity flex-shrink-0"
        >
          CODELENS
        </Link>

        {/* ── Desktop Centre Nav ────────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-8">
          {isAuthenticated && (
            <Link to="/dashboard" className={navLinkCls("/dashboard")}>
              Dashboard
            </Link>
          )}

          <Link to="/explore" className={navLinkCls("/explore")}>
            Explore
          </Link>

          {isAuthenticated && (
            <Link to="/codeforces" className={navLinkCls("/codeforces")}>
              Codeforces
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/account-center" className={navLinkCls("/account-center")}>
              Account
            </Link>
          )}

          {/* ── Tools Mega Menu Trigger ───────────────────────────────── */}
          <div
            className="relative"
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleMegaMouseLeave}
          >
            <button
              ref={megaTriggerRef}
              className={`flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.09em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                megaOpen ? "text-black" : "text-zinc-500 hover:text-black"
              }`}
              aria-haspopup="true"
              aria-expanded={megaOpen}
              aria-controls="tools-mega-menu"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setMegaOpen((v) => !v);
                  
                  setTimeout(() => {
                    firstMenuItemRef.current?.focus();
                  }, 0);
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setMegaOpen(false);
                  setTimeout(() => {
                    megaTriggerRef.current?.focus();
                  }, 0);
                }
              }}
            >
              <span
                className={
                  megaOpen
                    ? "underline underline-offset-4 decoration-[1.5px] decoration-black"
                    : ""
                }
              >
                Tools
              </span>
              <Chevron open={megaOpen} className="text-zinc-400" />
            </button>

            {megaOpen && (
              <MegaMenuPanel
                megaRef={megaRef}
                megaTriggerRef={megaTriggerRef}
                firstMenuItemRef={firstMenuItemRef}
                onMouseEnter={handleMegaMouseEnter}
                onMouseLeave={handleMegaMouseLeave}
                onClose={closeMenu}
              />
            )}
          </div>
        </div>

        {/* ── Desktop Right Controls ────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 flex-shrink-0">

          {/* APEX — sole primary CTA, inverted solid button */}
          <Link
            to="/apex-ai"
            title="APEX — Advanced Performance Excellence eXecutive. Your AI-powered growth strategist."
            className="flex items-center gap-1.5 px-3.5 py-2 bg-black text-white text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-zinc-800 transition-colors duration-150 rounded-[2px]"
          >
            <span className="text-[10px] leading-none opacity-70">◆</span>
            APEX
          </Link>

          {!isAuthenticated ? (
            <>
              {/* Login — text-only, minimal weight */}
              <Link
                to="/login"
                className="px-2 text-[13px] font-semibold uppercase tracking-[0.09em] text-zinc-500 hover:text-black transition-colors duration-150"
              >
                Login
              </Link>

              {/* Sign Up — outlined, secondary CTA */}
              <Link
                to="/signup"
                className="px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-black border border-zinc-800 hover:bg-black hover:text-white transition-colors duration-150 rounded-[2px]"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* User identity chip */}
              <div className="flex items-center gap-2 pl-3 border-l border-zinc-200">
                <span className="w-7 h-7 flex items-center justify-center bg-black text-white font-bold text-xs rounded-[2px] flex-shrink-0">
                  {getUserInitial()}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600 max-w-[90px] truncate">
                  {getUserDisplayName()}
                </span>
              </div>

              {/* GitHub Data — ghost/outline button */}
              <Link
                to="/github-intelligence"
                className="px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-zinc-500 border border-zinc-200 hover:border-zinc-700 hover:text-black transition-colors duration-150 rounded-[2px]"
              >
                GitHub
              </Link>

              {/* Logout — lowest visual weight, plain text */}
              <button
                onClick={handleLogout}
                className="px-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-zinc-400 hover:text-black transition-colors duration-150"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* ── Mobile Right: APEX + Hamburger ───────────────────────────── */}
        <div className="lg:hidden flex items-center gap-2.5">
          <Link
            to="/apex-ai"
            className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-zinc-800 transition-colors duration-150 rounded-[2px]"
          >
            <span className="text-[9px] opacity-70">◆</span>
            APEX
          </Link>

          {/* Animated hamburger — thinner, softer border */}
          <button
            ref={hamburgerRef}
            onClick={toggleMenu}
            className="flex flex-col justify-center items-center w-9 h-9 gap-[5px] border border-zinc-200 hover:border-zinc-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-[2px]"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span
              className={`w-5 h-px bg-zinc-800 transition-all duration-200 origin-center ${
                isMenuOpen ? "rotate-45 translate-y-[5px]" : ""
              }`}
            />
            <span
              className={`w-5 h-px bg-zinc-800 transition-opacity duration-200 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-5 h-px bg-zinc-800 transition-all duration-200 origin-center ${
                isMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div
          className="lg:hidden w-full bg-white border-t border-zinc-100 flex flex-col min-h-0"
          style={{ maxHeight: "calc(100vh - 3.5rem)", maxHeight: "calc(100svh - 3.5rem)", overflow: "hidden" }}
        >
          {/* Scrollable area */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">

            {/* Nav links */}
            {isAuthenticated && (
              <Link to="/dashboard" onClick={closeMenu} className={mobileLinkCls}>
                Dashboard <span className="text-zinc-300 text-sm">→</span>
              </Link>
            )}

            <Link to="/explore" onClick={closeMenu} className={mobileLinkCls}>
              Explore <span className="text-zinc-300 text-sm">→</span>
            </Link>

            {isAuthenticated && (
              <Link to="/codeforces" onClick={closeMenu} className={mobileLinkCls}>
                Codeforces <span className="text-zinc-300 text-sm">→</span>
              </Link>
            )}

            {isAuthenticated && (
              <Link to="/account-center" onClick={closeMenu} className={mobileLinkCls}>
                Account Center <span className="text-zinc-300 text-sm">→</span>
              </Link>
            )}

            {/* ── Tools accordion ──────────────────────────────────────── */}
            <button
              aria-expanded={mobileMegaOpen}
              aria-haspopup="true"
              onClick={() => setMobileMegaOpen((v) => !v)}
              className="px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.09em] text-zinc-600 border-b border-zinc-100 hover:bg-zinc-50 hover:text-black transition-colors duration-150 flex items-center justify-between w-full text-left"
            >
              <span>Tools</span>
              <Chevron open={mobileMegaOpen} className="text-zinc-400" />
            </button>

            {mobileMegaOpen && (
              <div className="bg-zinc-50/60 border-b border-zinc-100">
                {MEGA_MENU_ITEMS.map((item) => {
                  const hasSubmenu = item.submenu && item.submenu.length > 0;

                  if (hasSubmenu) {
                    const isExpanded = expandedSubmenu === item.label;
                    return (
                      <div key={item.label} className="border-b border-zinc-100 last:border-0">
                        {/* Accordion toggle */}
                        <button
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpandedSubmenu(isExpanded ? null : item.label)
                          }
                          className="w-full text-left px-7 py-3 bg-zinc-900 text-white flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm opacity-70">{item.icon}</span>
                              <span className="text-[11px] font-semibold uppercase tracking-[0.09em]">
                                {item.label}
                              </span>
                              <Tag label={item.tag} />
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5 pl-5 leading-snug font-normal">
                              {item.desc}
                            </p>
                          </div>
                          <Chevron open={isExpanded} className="text-zinc-400 ml-2 shrink-0" />
                        </button>

                        {isExpanded && (
                          <div className="bg-white">
                            {item.submenu.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.to}
                                onClick={closeMenu}
                                className="flex items-start gap-2.5 px-10 py-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 hover:text-black transition-colors duration-150"
                              >
                                <span className="text-sm mt-0.5">{sub.icon}</span>
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-zinc-800">
                                    {sub.label}
                                  </p>
                                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                                    {sub.desc}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Standard tool item
                  const Wrapper     = item.to ? Link : "div";
                  const wrapperProps = item.to ? { to: item.to, onClick: closeMenu } : {};

                  return (
                    <Wrapper
                      key={item.label}
                      {...wrapperProps}
                      className={`flex items-start gap-2.5 px-7 py-3 border-b border-zinc-100 last:border-0 transition-colors duration-150 ${
                        item.to
                          ? "cursor-pointer hover:bg-zinc-50 hover:text-black"
                          : "opacity-40 cursor-default"
                      }`}
                    >
                      <span className="text-sm mt-0.5 opacity-60">{item.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-zinc-800">
                            {item.label}
                          </span>
                          <Tag label={item.tag} />
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">{item.desc}</p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Auth section — pinned to bottom ──────────────────────────── */}
          <div className="flex-shrink-0 border-t border-zinc-100 bg-white">
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={closeMenu} className={mobileLinkCls}>
                  Login <span className="text-zinc-300 text-sm">→</span>
                </Link>
                <div className="px-4 py-3">
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="block w-full py-3 text-center text-[12px] font-bold uppercase tracking-[0.1em] bg-black text-white hover:bg-zinc-800 transition-colors duration-150 rounded-[2px]"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* User identity row */}
                <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/80">
                  <span className="w-8 h-8 flex items-center justify-center bg-black text-white font-bold text-sm rounded-[2px] flex-shrink-0">
                    {getUserInitial()}
                  </span>
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-zinc-600">
                    {getUserDisplayName()}
                  </span>
                </div>

                <Link to="/github-intelligence" onClick={closeMenu} className={mobileLinkCls}>
                  GitHub Data <span className="text-zinc-300 text-sm">→</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.09em] text-zinc-400 hover:text-black border-b border-zinc-100 hover:bg-zinc-50 transition-colors duration-150 text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}