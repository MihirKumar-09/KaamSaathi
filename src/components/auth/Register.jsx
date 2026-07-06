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
import Image from "next/image";

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
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto lg:overflow-hidden bg-[#09090f] flex flex-col lg:flex-row">
      {/* LEFT SIDE — FORM */}
      <div className="relative w-full lg:w-[45%] flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        {/* Decorative blurred blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 -left-10 h-64 w-64 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute top-1/3 right-0 h-48 w-48 rounded-full blur-[90px]" />

        <div className="relative z-10 w-full max-w-md">
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
        {/* Background Image */}
        <Image
          src="/auth/hero.jpeg"
          alt="KaamSaathi Hero"
          fill
          priority
          className="object-cover scale-110 blur-[3px] brightness-[0.55]"
        />

        {/* Dark Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-[#09090f]/70 via-[#16162b]/50 to-[#05060b]/90" />

        {/* Bottom Fade */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

        {/* Purple Glow */}
        <div className="absolute top-20 right-10 h-105 w-105 rounded-full bg-violet-600/20 blur-[140px]" />

        {/* Blue Glow */}
        <div className="absolute bottom-10 left-10 h-87.5 w-87.5 rounded-full bg-cyan-500/15 blur-[130px]" />

        {/* Liquid Divider */}
        <svg
          className="absolute -left-px top-0 h-full w-24 z-20"
          viewBox="0 0 100 800"
          preserveAspectRatio="none"
        >
          <path
            d="
      M0,0
      C40,90 5,170 28,250
      C55,330 5,420 28,500
      C55,580 5,660 28,740
      C35,775 18,790 0,800
      L0,0 Z"
            fill="#09090f"
          />
        </svg>

        {/* Content */}
        <div className="relative z-20 flex h-full flex-col justify-between px-16 py-20">
          {/* Hero Text */}
          <div className="max-w-xl">
            <h1 className="text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight">
              <span className="text-white drop-shadow-[0_8px_40px_rgba(0,0,0,.7)]">
                Welcome to
              </span>

              <br />

              <span className="bg-linear-to-r from-fuchsia-500 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                KaamSaathi
              </span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-slate-300 max-w-lg">
              Connecting skilled workers with trusted employers across India.
              Find jobs faster, hire confidently, and build your future with
              KaamSaathi.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5">
            {[
              {
                value: "48K+",
                label: "Workers",
              },
              {
                value: "12K+",
                label: "Employers",
              },
              {
                value: "99.9%",
                label: "Success Rate",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
              >
                <h2 className="text-4xl font-bold text-white">{item.value}</h2>

                <p className="mt-2 text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-6">
            {[
              "Verified Workers",
              "Trusted Employers",
              "Quick Hiring",
              "24×7 Support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check className="h-4 w-4 text-emerald-400" />
                </div>

                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
