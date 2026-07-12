"use client";

import { ArrowRight, BriefcaseBusiness, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#FFF9F3] px-4 py-6 md:px-6 md:py-0">
      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl sm:mb-5 sm:h-24 sm:w-24">
            <Image
              src="/logo/logo.png"
              alt="KaamSaathi Logo"
              width={96}
              height={96}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-4xl md:text-6xl">
            Welcome to <span className="text-orange-500">KaamSaathi</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base md:text-lg">
            India's trusted platform where workers find jobs and employers hire
            skilled people.
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-5 md:mt-12 md:grid-cols-2 md:gap-6">
          {/* Worker */}
          <Link
            href="/register?role=worker"
            className="
              group
              flex h-full flex-col rounded-3xl
              border border-orange-200
              bg-white/90
              p-6 md:p-8
              shadow-lg
              transition-all duration-300
              hover:-translate-y-2
              hover:border-orange-500
              hover:shadow-2xl
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 md:h-16 md:w-16">
                <BriefcaseBusiness className="text-orange-500" size={28} />
              </div>

              <ArrowRight
                className="text-orange-500 transition group-hover:translate-x-1"
                size={26}
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900 md:mt-8 md:text-3xl">
              Looking for Work
            </h2>

            <p className="mt-3 grow leading-7 text-slate-500 md:mt-4">
              Search nearby jobs, apply instantly and connect with trusted
              employers.
            </p>

            <div className="mt-auto pt-6 text-lg font-semibold text-orange-500 md:pt-8">
              Continue →
            </div>
          </Link>

          {/* Employer */}
          <Link
            href="/register?role=employer"
            className="
              group
              flex h-full flex-col rounded-3xl
              border border-blue-200
              bg-white/90
              p-6 md:p-8
              shadow-lg
              transition-all duration-300
              hover:-translate-y-2
              hover:border-blue-500
              hover:shadow-2xl
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 md:h-16 md:w-16">
                <Building2 className="text-blue-600" size={28} />
              </div>

              <ArrowRight
                className="text-blue-600 transition group-hover:translate-x-1"
                size={26}
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900 md:mt-8 md:text-3xl">
              Hiring Workers
            </h2>

            <p className="mt-3 grow leading-7 text-slate-500 md:mt-4">
              Post jobs, receive applications and hire skilled workers with
              ease.
            </p>

            <div className="mt-auto pt-6 text-lg font-semibold text-blue-600 md:pt-8">
              Continue →
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
