"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Menu,
  NotepadTextIcon,
  Save,
  Phone,
  Search,
  X,
  CloudUpload,
  BookOpen,
  CircleUserRound,
  User,
  Power,
  Settings,
  ShieldCheck,
  Briefcase,
  Building2,
} from "lucide-react";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";

const workerLinks = [
  {
    id: 1,
    name: "Home",
    href: "/worker/dashboard",
    icon: <Home size={20} />,
    color: "text-blue-600",
  },
  {
    id: 2,
    name: "Find Jobs",
    href: "/jobs",
    icon: <Search size={20} />,
    color: "text-emerald-600",
  },
  {
    id: 3,
    name: "Applied",
    href: "/applications",
    icon: <NotepadTextIcon size={20} />,
    color: "text-violet-600",
  },
  {
    id: 4,
    name: "Saved Jobs",
    href: "/saved-jobs",
    icon: <Save size={20} />,
    color: "text-rose-500",
  },
  {
    id: 5,
    name: "Contact Us",
    href: "/contact",
    icon: <Phone size={20} />,
    color: "text-amber-500",
  },
];

const employerLinks = [
  {
    id: 1,
    name: "Home",
    href: "/employer/dashboard",
    icon: <Home size={20} />,
    color: "text-blue-600",
  },
  {
    id: 2,
    name: "All Jobs",
    href: "/post-job",
    icon: <Briefcase size={20} />,
    color: "text-emerald-600",
  },
  {
    id: 3,
    name: "My Jobs",
    href: "/my-jobs",
    icon: <BookOpen size={20} />,
    color: "text-violet-600",
  },
  {
    id: 4,
    name: "Applications",
    href: "/applications",
    icon: <NotepadTextIcon size={20} />,
    color: "text-orange-500",
  },
  {
    id: 5,
    name: "Contact Us",
    href: "/contact",
    icon: <Phone size={20} />,
    color: "text-cyan-600",
  },
];

export default function NavbarLayout({ role: propRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Determine active role dynamically
  const role =
    propRole ||
    user?.role ||
    (pathname?.startsWith("/employer") ? "employer" : "worker");

  const navLinks = role === "employer" ? employerLinks : workerLinks;
  const isEmployer = role === "employer";

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setProfileOpen(false);
      setIsOpen(false);
      await logout();
    } catch (err) {
      console.error("Failed to logout:", err);
      router.push("/login");
    }
  };

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : isEmployer
    ? "E"
    : "W";

  return (
    <>
      <nav className="flex items-center justify-between w-full h-20 px-6 lg:px-12 bg-linear-to-r from-[#F8FAFC] via-[#E2E8F0] to-[#CBD5E1] border-b border-slate-300 shadow-[0_10px_35px_rgba(71,85,105,0.15)] sticky top-0 z-50">
        {/* Brand Logo */}
        <Link
          href={`/${role}/dashboard`}
          className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
        >
          <Image
            src="/logo/logo.png"
            alt="KaamSaathi Logo"
            height={60}
            width={60}
            className="h-12 w-auto object-contain"
            priority
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-800">
              Kaam<span className="text-orange-600">Saathi</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              {isEmployer ? "Employer Portal" : "Worker Portal"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-10">
          <ul className="hidden gap-8 font-medium lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`relative inline-block py-2 font-medium transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-blue-600 after:rounded-full after:transition-all after:duration-300 ${
                      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Profile Dropdown */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none flex items-center gap-2"
              aria-label="User profile menu"
            >
              <div
                className={`h-11 w-11 rounded-full bg-linear-to-br ${
                  isEmployer
                    ? "from-purple-600 to-indigo-600"
                    : "from-blue-500 to-indigo-600"
                } flex items-center justify-center text-white font-semibold text-lg shadow-lg ring-2 ring-white hover:ring-blue-300 transition`}
              >
                {userInitial}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 duration-200 z-50">
                {/* User Info Header */}
                <div className="bg-slate-50 p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full bg-linear-to-br ${
                        isEmployer
                          ? "from-purple-600 to-indigo-600"
                          : "from-blue-500 to-indigo-600"
                      } flex items-center justify-center text-white font-bold text-base shadow`}
                    >
                      {userInitial}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-800 text-sm truncate">
                        {user?.name || (isEmployer ? "Employer" : "Worker")}
                      </span>
                      <span className="text-xs text-slate-500 truncate">
                        {user?.email || "Signed In"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isEmployer
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isEmployer ? (
                        <Building2 size={12} />
                      ) : (
                        <Briefcase size={12} />
                      )}
                      {isEmployer ? "Employer" : "Worker"} Account
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <User size={18} />
                    <span className="font-medium text-sm">Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Settings size={18} />
                    <span className="font-medium text-sm">Settings</span>
                  </Link>

                  <Link
                    href="/privacy"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <ShieldCheck size={18} />
                    <span className="font-medium text-sm">Privacy</span>
                  </Link>

                  <div className="my-1.5 border-t border-gray-200"></div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-red-500 transition-all duration-200 hover:bg-red-50 cursor-pointer"
                  >
                    <Power size={18} />
                    <span className="font-medium text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-white/50 transition cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div
          className={`lg:hidden overflow-hidden bg-linear-to-br from-[#F8FAFC] via-[#EAF3FF] to-[#DCEEFF] backdrop-blur-xl border-b border-blue-100 shadow-[0_12px_35px_rgba(59,130,246,0.12)] transition-all duration-300 ease-out origin-top ${
            isOpen
              ? "opacity-100 translate-y-0 scale-y-100"
              : "opacity-0 -translate-y-5 scale-y-95 pointer-events-none"
          }`}
        >
          {/* User info on mobile */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-100 bg-white/40">
            <div
              className={`h-10 w-10 rounded-full bg-linear-to-br ${
                isEmployer
                  ? "from-purple-600 to-indigo-600"
                  : "from-blue-500 to-indigo-600"
              } flex items-center justify-center text-white font-bold text-base shadow`}
            >
              {userInitial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-slate-800 text-sm truncate">
                {user?.name || (isEmployer ? "Employer" : "Worker")}
              </span>
              <span className="text-xs text-slate-500">
                {isEmployer ? "Employer Account" : "Worker Account"}
              </span>
            </div>
          </div>

          <ul className="py-2">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`relative flex items-center gap-3 px-6 py-3.5 font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-white/90 text-blue-600 pl-8"
                        : "text-slate-700 hover:bg-white/70 hover:text-blue-600 hover:pl-8"
                    }`}
                  >
                    <span className={link.color}>{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>

                  {index !== navLinks.length - 1 && (
                    <div className="h-px mx-6 from-transparent via-blue-200 to-transparent bg-linear-to-r" />
                  )}
                </li>
              );
            })}

            <div className="h-px mx-6 my-2 from-transparent via-blue-200 to-transparent bg-linear-to-r" />

            <li>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-6 py-3.5 font-bold text-slate-700 hover:bg-white/70 hover:text-blue-600 transition"
              >
                <CircleUserRound className="text-blue-600" size={20} />
                <span>My Profile</span>
              </Link>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-6 py-3.5 font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <Power size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

