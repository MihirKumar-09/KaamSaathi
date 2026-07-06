"use client";

import { useState, useRef } from "react";
import {
  Eye,
  EyeOff,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Check,
} from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Join thousands of teams already building with Nova.
          </p>

          {/* Glass form card */}
          <form className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            {/* Profile image upload */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-white/20 bg-white/5 transition hover:border-fuchsia-400/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                aria-label="Upload profile image"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400 group-hover:text-fuchsia-300">
                    <Upload className="h-5 w-5" />
                  </div>
                )}
              </button>
              <div className="text-sm">
                <p className="font-medium text-white">Profile photo</p>
                <p className="text-slate-400">PNG or JPG, up to 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-slate-200"
              >
                Full name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Cooper"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30"
                />
              </div>
            </div>

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

            {/* Phone + Role */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-slate-200"
                >
                  Phone
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 555 000"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-1.5 block text-sm font-medium text-slate-200"
                >
                  Role
                </label>
                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                  <select
                    id="role"
                    name="role"
                    defaultValue=""
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30 [&>option]:bg-slate-900"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="member">Member</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-1.5 block text-sm font-medium text-slate-200"
              >
                Location
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="San Francisco, CA"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3.5 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30"
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

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-linear-to-r from-fuchsia-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition duration-200 hover:shadow-fuchsia-500/40 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Create account
            </button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <a
                href="#"
                className="font-medium text-fuchsia-400 hover:text-fuchsia-300"
              >
                Sign in
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
              Build something
              <br />
              extraordinary today.
            </h2>
            <p className="mt-4 text-base xl:text-lg text-white/80">
              Join a growing community of creators, teams, and businesses
              scaling their workflow with Nova's all-in-one platform.
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

          {/* Feature checklist */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {[
              "No credit card required",
              "Free 14-day trial",
              "Cancel anytime",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-white/80"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                  <Check className="h-3 w-3 text-emerald-300" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
