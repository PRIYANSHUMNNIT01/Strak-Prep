import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  LayoutDashboard,
  FileCode2,
  CheckCircle2,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ExternalLink,
  Sparkles,
  Flame,
  ChevronDown
} from "lucide-react";
import { getStoredProfile } from "../services/api";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = getStoredProfile();
  const isLoggedIn = !!localStorage.getItem("starkprep_auth") || !!localStorage.getItem("token");

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("starkprep_auth");
    localStorage.removeItem("token");
    setProfileDropdownOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/profile", icon: LayoutDashboard },
    { name: "Live Contests", path: "/contest-tracker", icon: Trophy, badge: "Live" },
    { name: "DSA Sheets", path: "/sheets", icon: FileCode2 },
    { name: "Verify Handles", path: "/verify-handles", icon: CheckCircle2 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#080B11]/95 border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/25 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Stark<span className="text-purple-400">Prep</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1 flex items-center gap-1">
                CP Tracker
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                    active
                      ? "text-white bg-slate-800 shadow-sm border border-slate-700"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-purple-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: GitHub repo + User Profile / Auth */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/PRIYANSHUMNNIT01/Strak-Prep"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all"
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt="avatar"
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-purple-500/30"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-slate-800/80">
                    <p className="font-semibold text-white">{user?.fullName || "Priyanshu Kumar"}</p>
                    <p className="text-xs text-slate-400 truncate">@{user?.profileStats?.codeforces?.handle || "priyanshu_dev"}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  >
                    <User className="w-4 h-4 text-purple-400" />
                    <span>My Portfolio</span>
                  </Link>
                  <Link
                    to="/sheets"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  >
                    <FileCode2 className="w-4 h-4 text-indigo-400" />
                    <span>DSA Sheets</span>
                  </Link>
                  <Link
                    to="/verify-handles"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verify Handles</span>
                  </Link>
                  <Link
                    to="/edit-profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                    <span>Edit Profile</span>
                  </Link>
                  <div className="border-t border-slate-800/80 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {!isLoggedIn && (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20 transition-all"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#090D16] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? "text-white bg-slate-800 border border-slate-700" : "text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-purple-400" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-sm rounded-lg border border-slate-700 text-slate-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-sm rounded-lg bg-purple-600 text-white font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
