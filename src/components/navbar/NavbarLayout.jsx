"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  BriefcaseBusiness,
  FileText,
  Heart,
  Phone,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { useState } from "react";

const workerLinks = [
  { id: 1, name: "Home", href: "/worker/dashboard" },
  { id: 2, name: "Find Jobs", href: "/jobs" },
  { id: 3, name: "Applications", href: "/applications" },
  { id: 4, name: "Saved Jobs", href: "/saved-jobs" },
  { id: 5, name: "Contact Us", href: "/contact" },
];

const employerLinks = [
  { id: 1, name: "Home", href: "/employer/dashboard" },
  { id: 2, name: "Post Job", href: "/post-job" },
  { id: 3, name: "My Jobs", href: "/my-jobs" },
  { id: 4, name: "Applications", href: "/applications" },
  { id: 5, name: "Contact Us", href: "/contact" },
];
export default function NavbarLayout() {
  const [isOpen, setIsOpen] = useState(false);
  // Temporary for testing;
  const role = "worker";
  const navLinks = role === "worker" ? workerLinks : employerLinks;
  return (
    <>
      <div className="flex items-center justify-between w-full h-20 px-6 lg:px-12 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-md sticky top-0 z-50">
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
          <ul className="hidden lg:flex gap-12 font-medium ">
            {navLinks.map((link) => (
              <li
                key={link.id}
                className="hover:text-green-600 transition-all duration-300"
              >
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
          <Menu size={28} />
        </button>
      </div>
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-screen w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Image src="/logo/logo.png" alt="Logo" width={48} height={48} />

                <div>
                  <h2 className="font-bold text-lg text-gray-900">
                    KaamSaathi
                  </h2>
                  <p className="text-xs text-gray-500">Find Local Jobs</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
              >
                <X size={22} />
              </button>
            </div>

            {/* Navigation */}
            <ul className="flex-1 px-4 py-6 space-y-2">
              {navLinks.map((link) => {
                let Icon;

                switch (link.name) {
                  case "Home":
                    Icon = Home;
                    break;

                  case "Find Jobs":
                  case "Post Job":
                    Icon = BriefcaseBusiness;
                    break;

                  case "Applications":
                    Icon = FileText;
                    break;

                  case "Saved Jobs":
                  case "My Jobs":
                    Icon = Heart;
                    break;

                  case "Contact Us":
                    Icon = Phone;
                    break;

                  default:
                    Icon = Home;
                }

                return (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-700 font-medium hover:bg-green-50 hover:text-green-700 transition-all duration-300"
                    >
                      <Icon size={20} />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Bottom Profile */}
            <div className="border-t border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <UserCircle2 size={28} className="text-green-700" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Mihir Kumar</h3>

                  <p className="text-sm text-gray-500 capitalize">{role}</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 text-red-600 py-3 font-semibold hover:bg-red-100 transition">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
