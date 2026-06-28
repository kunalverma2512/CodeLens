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
  const coreTools = MEGA_MENU_ITEMS.filter((item) => !item.submenu);
  const contestArsenal = MEGA_MENU_ITEMS.find((item) => item.submenu);

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
      className="absolute top-full left-1/2 mt-5 w-[700px] bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 animate-dropdown"
      style={{ transform: "translateX(-50%)" }}
    >
      <div className="flex">
        {/* Left Pane: Core Tools */}
        <div className="flex-1 p-6 bg-white border-r-[3px] border-black relative overflow-hidden">
          {/* Subtle grid pattern background to look premium */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
          
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-5 relative z-10">
            Core Arsenal
          </p>
          <div className="flex flex-col gap-2 relative z-10">
            {coreTools.map((item, idx) => {
              const Wrapper = item.to ? Link : "div";
              const wrapperProps = item.to ? { to: item.to, onClick: onClose } : {};

              return (
                <Wrapper
                  ref={idx === 0 ? firstMenuItemRef : null}
                  key={item.label}
                  {...wrapperProps}
                  className={`group p-3 border-2 transition-all duration-200 ease-out ${
                    item.to 
                      ? "border-transparent hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 cursor-pointer bg-white relative z-20" 
                      : "border-transparent opacity-50 cursor-default"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    {/* Icon wrapper */}
                    <div className="w-7 h-7 flex items-center justify-center bg-zinc-100 border border-zinc-200 group-hover:bg-black group-hover:text-white transition-colors duration-200 rounded-sm">
                      <span className="text-sm leading-none opacity-80 group-hover:opacity-100">
                        {item.icon}
                      </span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.1em] text-zinc-800 group-hover:text-black">
                      {item.label}
                    </span>
                    <Tag label={item.tag} />
                  </div>
                  <p className="text-[11px] text-zinc-500 pl-10 leading-snug font-medium">
                    {item.desc}
                  </p>
                </Wrapper>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Contest Arsenal */}
        <div className="w-[320px] p-6 bg-zinc-50 relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-5">
            Contest Solutions
          </p>
          <div className="flex flex-col gap-2">
            {contestArsenal.submenu.map((sub) => (
              <Link
                key={sub.label}
                to={sub.to}
                onClick={onClose}
                className="group flex items-start gap-3 p-3 bg-white border-2 border-zinc-200 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200 ease-out cursor-pointer"
              >
                <span className="text-base leading-none mt-0.5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-200">
                  {sub.icon}
                </span>
                <div>
                  <span className="block text-[11px] font-black uppercase tracking-[0.1em] text-zinc-800 group-hover:text-black mb-1">
                    {sub.label}
                  </span>
                  <p className="text-[10px] text-zinc-500 leading-snug font-medium">
                    {sub.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="px-6 py-4 border-t-[3px] border-black bg-black flex items-center justify-between text-white group cursor-pointer hover:bg-zinc-900 transition-colors" onClick={onClose}>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-300">
          Explore all integrations
        </span>
        <span className="text-sm group-hover:translate-x-2 transition-transform duration-200 ease-out">
          →
        </span>
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

  const LogoutButton = ({ className = "" }) => (
    <button
      type="button"
      onClick={handleLogout}
      className={`px-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-zinc-400 hover:text-black transition-colors duration-150 ${className}`}
    >
      Logout
    </button>
  );

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
          <Link to="/faq" className={navLinkCls("/faq")}>
            FAQ
          </Link>
          
          <Link to="/about" className={navLinkCls("/about")}>
            About
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
           <Link to="/contact" className={navLinkCls("/contact")}>
            Contact Us
          </Link>
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
              <LogoutButton />
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
            <Link to="/faq" onClick={closeMenu} className={mobileLinkCls}>
              FAQ <span className="text-zinc-300 text-sm">→</span>
            </Link>
            <Link to="/about" onClick={closeMenu} className={mobileLinkCls}>
              About <span className="text-zinc-300 text-sm">→</span>
            </Link>
            <Link to="/contact" onClick={closeMenu} className={mobileLinkCls}>
              Contact Us <span className="text-zinc-300 text-sm">→</span>
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
                          className="w-full text-left px-7 py-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 flex items-center justify-between transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm opacity-70">{item.icon}</span>
                              <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-zinc-800">
                                {item.label}
                              </span>
                              <Tag label={item.tag} />
                            </div>
                            <p className="text-[11px] text-zinc-500 mt-1 pl-6 leading-snug font-normal">
                              {item.desc}
                            </p>
                          </div>
                          <Chevron open={isExpanded} className="text-zinc-400 ml-2 shrink-0" />
                        </button>

                        {isExpanded && (
                          <div className="bg-white pb-2">
                            {item.submenu.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.to}
                                onClick={closeMenu}
                                className="flex items-start gap-2.5 px-10 py-3 border-l-2 border-transparent hover:border-black hover:bg-zinc-50 hover:text-black transition-colors duration-150"
                              >
                                <span className="text-sm mt-0.5 grayscale opacity-80">{sub.icon}</span>
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
                      className={`flex items-start gap-2.5 px-7 py-4 border-b border-zinc-100 last:border-0 transition-colors duration-150 ${
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
                        <p className="text-[11px] text-zinc-400 leading-snug mt-1">{item.desc}</p>
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

                <LogoutButton className="w-full px-5 py-3.5 text-[13px] border-b border-zinc-100 hover:bg-zinc-50 text-left" />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}