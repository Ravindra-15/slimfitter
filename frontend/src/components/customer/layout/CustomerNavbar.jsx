/**
 * CUSTOMER MODULE — Top Navbar
 */
import React, { useState, useContext, useEffect, useRef, useMemo } from "react";

import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

import { Menu, X, Bell } from "lucide-react";
import toast from "react-hot-toast";

import AuthContext from "../../../context/AuthContext";
import { hasActiveProgramSubscription } from "../../../utils/subscriptionCheck";
import { PROGRAM_ID } from "../../../utils/programConfig";
// ============================================
// 🔗 NAV LINK CONFIGS
// ============================================
const PUBLIC_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/home#programs", label: "Our Programs" },
  { to: "/book-doctor", label: "Book Doctor" },
];

const PRIVATE_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/home#programs", label: "Our Programs" },
  { to: "/book-doctor", label: "Book Doctor" },
  { to: "/my-appointments", label: "My Appointments" },
];

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useContext(AuthContext) || {};

  const isLoggedIn = !!auth?.token;

  // Safe parse with try-catch (prevents crash on bad/null storage values)
  const getStoredUser = () => {
    try {
      const raw =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const storedUser = useMemo(() => getStoredUser(), [auth?.token]);

  const profileCompleted = !!(
    storedUser?.fullName &&
    storedUser?.dob &&
    storedUser?.country &&
    storedUser?.city
  );

  // 🎟️ subscription status — gates Home(→dashboard) + Add Progress links
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!isLoggedIn) {
      setIsSubscribed(false);
      return;
    }
    (async () => {
      const ok = await hasActiveProgramSubscription();
      if (mounted) setIsSubscribed(ok);
    })();
    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  // dashboard path for this program
  const dashboardPath = `/programs/${PROGRAM_ID}/dashboard`;

  // Home click — subscribed → dashboard; logged-in unsubscribed → toast; else landing
  const handleHomeClick = (e) => {
    if (!isLoggedIn) return; // logged out → let the link go to /home normally
    e.preventDefault();
    closeMobile();
    if (isSubscribed) {
      navigate(dashboardPath);
    } else {
      toast.error("Purchase a plan to unlock the video dashboard");
    }
  };

  // Add Progress click — go to dashboard and auto-open the habit form
  const handleAddProgressClick = (e) => {
    e.preventDefault();
    closeMobile();
    navigate(`${dashboardPath}?openProgress=1`);
  };
  // ============================================
  // 🚫 HIDE AUTH UI ON AUTH PAGES
  // ============================================
  const authHiddenRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
  ];

  const hideAuthUI = authHiddenRoutes.includes(location.pathname);

  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerRef = useRef(null);

  // const links = isLoggedIn && profileCompleted ? PRIVATE_LINKS : PUBLIC_LINKS;
  // base links by auth state
  const baseLinks =
    isLoggedIn && profileCompleted ? PRIVATE_LINKS : PUBLIC_LINKS;

  // subscribed users get an extra "Add Progress" link
  const links = isSubscribed
    ? [
        ...baseLinks,
        { to: dashboardPath, label: "Add Progress", isAddProgress: true },
      ]
    : baseLinks;

  const closeMobile = () => setMobileOpen(false);

  // Scroll to #programs after we've landed on /home
  useEffect(() => {
    if (location.pathname === "/home" && location.hash === "#programs") {
      // wait a tick so the section is mounted
      const id = setTimeout(() => {
        document
          .getElementById("programs")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => clearTimeout(id);
    }
  }, [location.pathname, location.hash]);

  const handleProgramsClick = (e) => {
    e.preventDefault();
    closeMobile();
    if (location.pathname === "/home") {
      // already on home → just scroll
      document
        .getElementById("programs")
        ?.scrollIntoView({ behavior: "smooth" });
      // keep hash in sync (optional)
      navigate("/home#programs", { replace: true });
    } else {
      // different page → navigate, effect above handles the scroll
      navigate("/home#programs");
    }
  };

  // ============================================
  // ✅ CLOSE ON SCROLL
  // ============================================
  useEffect(() => {
    if (!mobileOpen) return;

    const handleScroll = () => closeMobile();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  // ============================================
  // ✅ CLOSE ON OUTSIDE CLICK
  // ============================================
  useEffect(() => {
    if (!mobileOpen) return;

    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        closeMobile();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileOpen]);

  return (
    <div ref={drawerRef}>
      <header className="fixed  top-0 left-0 w-full z-40 bg-white border-b border-[#E3DFF0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* 🏷️ BRAND */}
            <Link
              to="/home"
              className="text-xl font-bold text-[#083B44] tracking-tight flex-shrink-0"
              onClick={closeMobile}
            >
              Slimfitter
            </Link>

            {/* 🖥️ DESKTOP LINKS */}
            <div className="hidden lg:flex items-center justify-center gap-48 flex-1">
              {/* {links.map((link) =>
  link.to.includes("#") ? (
    <a
      key={link.to}
      href={link.to}
      onClick={handleProgramsClick}
      className="
        relative text-sm font-medium tracking-wide
        text-[#6B7280] hover:text-[#4E4391]
        transition-all duration-300
        hover:-translate-y-[1px]
        after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:w-0
        after:bg-[#4E4391]
        after:rounded-full
        after:transition-all after:duration-300
        hover:after:w-full
      "
    >
      {link.label}
    </a>
  ) : ( */}
              {links.map((link) =>
                link.isAddProgress ? (
                  <a
                    key="add-progress"
                    href={link.to}
                    onClick={handleAddProgressClick}
                    className="
        relative text-sm font-medium tracking-wide
        text-gray-600 hover:text-teal-700
        transition-all duration-300 hover:-translate-y-[1px]
        after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:w-0 after:bg-[#4E4391] after:rounded-full
        after:transition-all after:duration-300 hover:after:w-full
      "
                  >
                    {link.label}
                  </a>
                ) : link.label === "Home" ? (
                  <a
                    key="home-desktop"
                    href={link.to}
                    onClick={handleHomeClick}
                    className="
        relative text-sm font-medium tracking-wide
        text-[#6B7280] hover:text-[#4E4391]
        transition-all duration-300 hover:-translate-y-[1px]
        after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:w-0 after:bg-[#4E4391] after:rounded-full
        after:transition-all after:duration-300 hover:after:w-full
      "
                  >
                    {link.label}
                  </a>
                ) : link.to.includes("#") ? (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={handleProgramsClick}
                    className="
        relative text-sm font-medium tracking-wide
        text-gray-600 hover:text-teal-700
        transition-all duration-300 hover:-translate-y-[1px]
        after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:w-0 after:bg-[#4E4391] after:rounded-full
        after:transition-all after:duration-300 hover:after:w-full
      "
                  >
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `relative text-sm font-medium tracking-wide
                      transition-all duration-300 hover:-translate-y-[1px]
                      after:absolute after:left-0 after:-bottom-1
                      after:h-[2px] after:w-0
                      after:bg-[#4E4391] after:rounded-full
                      after:transition-all after:duration-300
                      hover:after:w-full ${
                        isActive
                          ? "text-[#083B44] hover:text-[#4E4391]"
                          : "text-[#6B7280] hover:text-[#4E4391]"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ),
              )}
            </div>

            {/* 🎯 RIGHT SIDE */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!hideAuthUI && isLoggedIn && profileCompleted ? (
                <>
                  {/* 🔔 NOTIFICATIONS */}
                  <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                      `hidden sm:inline-flex w-10 h-10 rounded-full items-center justify-center transition-colors ${
                        isActive
                          ? "bg-teal-50 text-[#083B44]"
                          : "text-[#6B7280] hover:bg-[#EFEDFA]"
                      }`
                    }
                    aria-label="Notifications"
                  >
                    <Bell size={18} />
                  </NavLink>

                  {/* 👤 PROFILE */}
                  <button
                    type="button"
                    onClick={() => navigate("/my-profile")}
                    className="
                      hidden sm:inline-flex items-center
                      px-5 py-2 rounded-full
                      text-sm font-semibold text-white
                      bg-[#4E4391] hover:bg-[#4E4391]
                      transition-colors
                     shadow-[0_6px_18px_rgba(90,79,159,0.28)]
                    "
                  >
                    Profile
                  </button>
                </>
              ) : !hideAuthUI ? (
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="
                    hidden sm:inline-flex items-center
                    px-5 py-2 rounded-full
                    text-sm font-semibold text-white
                   bg-[#4E4391] hover:bg-[#4E4391]
                    transition-colors
                    shadow-[0_6px_18px_rgba(90,79,159,0.28)]
                  "
                >
                  Join now
                </button>
              ) : null}

              {/* 📱 MOBILE MENU */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#EFEDFA]"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* 📱 MOBILE DRAWER */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E3DFF0] bg-white">
            <div className="px-4 py-3 flex flex-col gap-1">
              {/* {links.map((link) =>
                link.to.includes("#") ? (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={handleProgramsClick}
                    className="
        px-3 py-2 rounded-lg text-sm font-medium
        text-[#6B7280]
        hover:bg-[#EEF2FF]
        hover:text-[#4F46E5]
        transition-all duration-300
      "
                  >
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#EEF2FF] text-[#4F46E5]"
                          : "text-[#374151] hover:bg-[#EEF2FF] hover:text-[#4F46E5]"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ),
              )} */}
              {links.map((link) =>
                link.isAddProgress ? (
                  <a
                    key="add-progress-m"
                    href={link.to}
                    onClick={handleAddProgressClick}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
                  >
                    {link.label}
                  </a>
                ) : link.label === "Home" ? (
                  <a
                    key="home-mobile"
                    href={link.to}
                    onClick={handleHomeClick}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
                  >
                    {link.label}
                  </a>
                ) : link.to.includes("#") ? (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={handleProgramsClick}
                    className="
        px-3 py-2 rounded-lg text-sm font-medium
        text-gray-600
        hover:bg-teal-50
        hover:text-teal-700
        transition-all duration-300
      "
                  >
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#EEF2FF] text-[#4F46E5]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ),
              )}

              {!hideAuthUI && isLoggedIn && profileCompleted ? (
                <>
                  <NavLink
                    to="/notifications"
                    onClick={closeMobile}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#374151] hover:bg-[#EEF2FF] hover:text-[#4F46E5]"
                  >
                    Notifications
                  </NavLink>

                  <button
                    type="button"
                    onClick={() => {
                      closeMobile();
                      navigate("/my-profile");
                    }}
                    className="
                      mt-1 px-4 py-2 rounded-full self-start
                      text-xs font-semibold text-white
                      bg-[#4E4391] hover:bg- [#4E4391]
                      transition-colors
                    "
                  >
                    Profile
                  </button>
                </>
              ) : !hideAuthUI ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    navigate("/signup");
                  }}
                  className="
                    mt-1 px-4 py-2 rounded-full self-start
                    text-xs font-semibold text-white
                    bg-[#4E4391] hover:bg- [#4E4391]
                    transition-colors
                  "
                >
                  Join now
                </button>
              ) : null}
            </div>
          </div>
        )}
      </header>
      <div className="h-16" />
    </div>
  );
};

export default CustomerNavbar;
