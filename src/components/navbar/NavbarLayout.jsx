"use client";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { useState } from "react";

const workerLinks = [
  {
    id: 1,
    name: "Home",
    href: "/worker/dashboard",
    icon: <Home />,
    color: "text-blue-600",
  },
  {
    id: 2,
    name: "Find Jobs",
    href: "/jobs",
    icon: <Search />,
    color: "text-emerald-600",
  },
  {
    id: 3,
    name: "Applications",
    href: "/applications",
    icon: <NotepadTextIcon />,
    color: "text-violet-600",
  },
  {
    id: 4,
    name: "Saved Jobs",
    href: "/saved-jobs",
    icon: <Save />,
    color: "text-rose-500",
  },
  {
    id: 5,
    name: "Contact Us",
    href: "/contact",
    icon: <Phone />,
    color: "text-amber-500",
  },
];

const employerLinks = [
  {
    id: 1,
    name: "Home",
    href: "/employer/dashboard",
    icon: <Home />,
    color: "text-blue-600",
  },
  {
    id: 2,
    name: "Post Job",
    href: "/post-job",
    icon: <CloudUpload />,
    color: "text-emerald-600",
  },
  {
    id: 3,
    name: "My Jobs",
    href: "/my-jobs",
    icon: <BookOpen />,
    color: "text-violet-600",
  },
  {
    id: 4,
    name: "Applications",
    href: "/applications",
    icon: <NotepadTextIcon />,
    color: "text-orange-500",
  },
  {
    id: 5,
    name: "Contact Us",
    href: "/contact",
    icon: <Phone />,
    color: "text-cyan-600",
  },
];
export default function NavbarLayout() {
  const [isOpen, setIsOpen] = useState(false);
  // Temporary for testing;
  const role = "worker";
  const navLinks = role === "worker" ? workerLinks : employerLinks;
  return (
    <>
      <div className="flex items-center justify-between w-full h-20 px-6 lg:px-12 bg-linear-to-r from-[#F8FAFC] via-[#E2E8F0] to-[#CBD5E1] border-b border-slate-300 shadow-[0_10px_35px_rgba(71,85,105,0.15)] sticky top-0 z-50">
        <Link href={`/${role}/dashboard`}>
          <div>
            <Image
              src="/logo/logo.png"
              alt="KaamSaathi Logo"
              height={80}
              width={80}
            />
          </div>
        </Link>
        <div>
          <ul className="hidden gap-12 font-medium lg:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="
          relative
          inline-block
          py-2
          font-medium
          text-gray-800
          transition-all
          duration-300
          hover:text-blue-500
          after:content-['']
          after:absolute
          after:left-0
          after:-bottom-1
          after:h-0.5
          after:w-0
          after:bg-blue-500
          after:rounded-full
          after:transition-all
          after:duration-300
          hover:after:w-full
        "
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {isOpen && (
        <div
          className={`
  lg:hidden
  overflow-hidden
  bg-linear-to-br
  from-[#F8FAFC]
  via-[#EAF3FF]
  to-[#DCEEFF]
  backdrop-blur-xl
  border-b
  border-blue-100
  shadow-[0_12px_35px_rgba(59,130,246,0.12)]
  transition-all
  duration-300
  ease-out
  origin-top
  ${
    isOpen
      ? "opacity-100 translate-y-0 scale-y-100"
      : "opacity-0 -translate-y-5 scale-y-95 pointer-events-none"
  }
`}
        >
          <div className="flex items-center justify-end px-6 py-4 border-b border-blue-100"></div>
          <ul>
            {navLinks.map((link, index) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`relative
  flex
  items-center
  gap-3
  px-6
  py-4
  font-bold
  text-slate-700
  transition-all
  duration-300
  hover:bg-white/70
  hover:text-blue-600
  hover:pl-8`}
                >
                  <span className={link.color}>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>

                {index !== navLinks.length - 1 && (
                  <div className="h-px mx-6 from-transparent via-blue-200 to-transparent bg-linear-to-r" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
