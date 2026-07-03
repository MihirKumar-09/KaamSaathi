"use client";

import { ArrowRight, BriefcaseBusiness, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] flex items-center justify-center">
      <div className="relative z-10 w-full max-w-6xl px-5">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl">
            <Image
              src="/logo/logo.png"
              alt="KaamSaathi Logo"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-6xl">
            Welcome to <span className="text-orange-500">KaamSaathi</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
            India's trusted platform where workers find jobs and employers hire
            skilled people.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2 items-stretch">
          {/* Worker */}
          <Link href="/worker/dashboard" className="h-full">
            <button
              className="
        group
        flex h-full w-full flex-col
        rounded-3xl
        border border-orange-200
        bg-white/90
        p-8
        shadow-lg
        transition-all duration-300
        hover:-translate-y-2
        hover:border-orange-500
        hover:shadow-2xl
        cursor-pointer
      "
            >
              <div className="flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                  <BriefcaseBusiness className="text-orange-500" size={30} />
                </div>

                <ArrowRight
                  className="text-orange-500 transition group-hover:translate-x-1"
                  size={28}
                />
              </div>

              <h2 className="mt-8 text-3xl font-bold text-slate-900">
                Looking for Work
              </h2>

              <p className="mt-4 text-slate-500 leading-7 grow">
                Search nearby jobs, apply instantly and connect with trusted
                employers.
              </p>

              <div className="mt-auto pt-8 font-semibold text-orange-500 text-lg">
                Continue →
              </div>
            </button>
          </Link>

          {/* Employer */}
          <Link href="/employer/dashboard" className="h-full">
            <button
              className="
        group
        flex h-full w-full flex-col
        rounded-3xl
        border border-blue-200
        bg-white/90
        p-8
        shadow-lg
        transition-all duration-300
        hover:-translate-y-2
        hover:border-blue-500
        hover:shadow-2xl
        cursor-pointer
      "
            >
              <div className="flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Building2 className="text-blue-600" size={30} />
                </div>

                <ArrowRight
                  className="text-blue-600 transition group-hover:translate-x-1"
                  size={28}
                />
              </div>

              <h2 className="mt-8 text-3xl font-bold text-slate-900">
                Hiring Workers
              </h2>

              <p className="mt-4 text-slate-500 leading-7 grow">
                Post jobs, receive applications and hire skilled workers with
                ease.
              </p>

              <div className="mt-auto pt-8 font-semibold text-blue-600 text-lg">
                Continue →
              </div>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
