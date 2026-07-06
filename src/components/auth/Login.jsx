"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto lg:overflow-hidden bg-slate-950 flex flex-col lg:flex-row">
      {/* LEFT SIDE — FORM */}
      <div className="relative w-full lg:w-[45%] flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16 bg-slate-950">
        {/* Decorative blurred blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-600/30 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-indigo-600/30 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/3 right-0 h-48 w-48 rounded-full bg-cyan-500/20 blur-[90px]" />

        <div className="relative z-10 w-full max-w-md">
          {/* Logo / Brand */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-fuchsia-500 to-indigo-600 shadow-lg shadow-fuchsia-500/30">
              <span className="text-lg font-bold text-white">N</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              Nova
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue to your dashboard.
          </p>

          {/* Glass form card */}
          <form className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-200"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-fuchsia-400 hover:text-fuchsia-300"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/50 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-sm text-slate-400">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-linear-to-r from-fuchsia-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition duration-200 hover:shadow-fuchsia-500/40 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-500">or continue with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.6 14.7 2.6 12 2.6 6.9 2.6 2.7 6.8 2.7 12S6.9 21.4 12 21.4c6.9 0 9.3-4.8 9.3-7.3 0-.5-.05-.9-.13-1.3H12z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
                </svg>
                GitHub
              </button>
            </div>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-fuchsia-400 hover:text-fuchsia-300"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE — HERO */}
      <div className="relative hidden lg:block lg:w-[55%] h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop"
          alt="Team collaborating"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/70 via-fuchsia-900/50 to-slate-950/80" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

        {/* Decorative blurred blobs */}
        <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-32 left-10 h-80 w-80 rounded-full bg-indigo-400/20 blur-[120px]" />

        {/* Liquid SVG wave divider */}
        <svg
          className="absolute -left-1 top-0 h-full w-24 text-slate-950"
          viewBox="0 0 100 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0
               C 40,80 10,160 30,240
               C 55,320 10,400 30,480
               C 50,560 10,640 30,720
               C 40,760 20,780 0,800
               L0,0 Z"
            fill="currentColor"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex justify-end">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              Trusted by 12,000+ teams
            </span>
          </div>

          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight text-white">
              Your work,
              <br />
              right where you left it.
            </h2>
            <p className="mt-4 text-base xl:text-lg text-white/80">
              Pick up your projects, dashboards, and conversations exactly where
              you left off.
            </p>
          </div>

          {/* Floating glass stat cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active users", value: "48K+" },
              { label: "Countries", value: "120+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
