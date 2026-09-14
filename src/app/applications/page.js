"use client";

import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import WorkerApplications from "@/components/Applications/WorkerApplications";
import EmployerApplications from "@/components/Applications/EmployerApplications";
import NavbarLayout from "@/components/navbar/NavbarLayout";
import FooterLayout from "@/components/footer/FooterLayout";
import { Briefcase, Lock, ArrowRight, Loader2, Users } from "lucide-react";

export default function ApplicationsPage() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <NavbarLayout role="worker" />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <Loader2 size={32} className="animate-spin text-orange-500 mb-3" />
          <p className="text-sm font-bold text-slate-600">Loading your applications...</p>
        </main>
        <FooterLayout />
      </div>
    );
  }

  // Not logged in: Show clear access options
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <NavbarLayout role="worker" />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Login Required</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Please sign in to view and manage your job applications on KaamSaathi.
            </p>

            <div className="mt-6 space-y-2.5">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 transition cursor-pointer"
              >
                <span>Log In to Your Account</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition cursor-pointer"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </main>
        <FooterLayout />
      </div>
    );
  }

  // Conditional Rendering based on Role
  if (user.role === "employer") {
    return <EmployerApplications />;
  }

  // Default for worker or general user: Worker Applications
  return <WorkerApplications />;
}
