import Image from "next/image";
import { Unbounded } from "next/font/google";
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
import { Ubuntu } from "next/font/google";
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  ImagePlus,
  Rocket,
  CheckCheckIcon,
  Heart,
} from "lucide-react";
import Link from "next/link";
export default function Register() {
  return (
    <div className="h-screen w-full flex flex-col items-center  md:flex-row">
      {/* Left Container */}
      <div className="relative hidden h-screen w-[45%] overflow-hidden md:flex">
        {/* Background Image */}
        <Image
          src="/auth/hero.jpeg"
          alt="Hero"
          fill
          priority
          className="scale-110 object-cover blur-md"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col px-12 py-16 text-white">
          {/* Main Content */}
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight xl:text-6xl">
              Welcome to <br />
              <span
                className={`${unbounded.className} bg-linear-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent`}
              >
                KaamSaathi
              </span>
            </h1>

            <p
              className={`${ubuntu.className} mt-6 max-w-md text-lg leading-8 text-gray-200`}
            >
              Find jobs, connect with trusted employers, and build your career
              with confidence—all in one place.
            </p>

            {/* Feature Badges */}
            <div className="mt-8 flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20">
                <Lock size={16} className="text-cyan-400" />
                Secure
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20">
                <CheckCheckIcon size={16} className="text-green-400" />
                Verified Jobs
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20">
                <Rocket size={16} className="text-violet-400" />
                Career Growth
              </span>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="border-t border-white/10 pt-6">
            <h4
              className={`${unbounded.className} flex items-center gap-2 text-lg font-medium`}
            >
              Start Your Career Today
              <Heart
                size={18}
                className="fill-red-500 text-red-500 animate-pulse"
              />
            </h4>

            <p className="mt-2 text-sm text-gray-300">
              Thousands of opportunities are waiting for you.
            </p>
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 px-10 md:w-[55%]">
        {/* Glow */}
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-black-300/30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl"></div>

        {/* Glass Card */}
        <div className="relative z-10 w-full max-w-2xl rounded-4xl border border-white/50 bg-white/45 p-8 shadow-[0_20px_80px_rgba(31,41,55,0.18)] backdrop-blur-3xl">
          {/* Heading */}
          <div className="mb-8">
            <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
              Join KaamSaathi
            </span>

            <h2 className="mt-4 text-4xl font-bold text-slate-900">
              Create Your Account
            </h2>

            <p className="mt-2 text-slate-600">
              Start your journey and build your career with confidence.
            </p>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
              />

              <input
                type="text"
                placeholder="Enter your full name"
                className="h-12 w-full rounded-xl border border-white/60 bg-white/50 pl-12 pr-4 text-slate-800 placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/70 focus:ring-4 focus:ring-cyan-200/50"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="h-12 w-full rounded-xl border border-white/60 bg-white/50 pl-12 pr-4 outline-none backdrop-blur-xl transition focus:border-cyan-400 focus:bg-white/70"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
                />

                <input
                  type="text"
                  placeholder="Phone"
                  className="h-12 w-full rounded-xl border border-white/60 bg-white/50 pl-12 pr-4 outline-none backdrop-blur-xl transition focus:border-cyan-400 focus:bg-white/70"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
              />

              <input
                type="password"
                placeholder="Create password"
                className="h-12 w-full rounded-xl border border-white/60 bg-white/50 pl-12 pr-4 outline-none backdrop-blur-xl transition focus:border-cyan-400 focus:bg-white/70"
              />
            </div>
          </div>

          {/* Location + Upload */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
                />

                <input
                  type="text"
                  placeholder="Location"
                  className="h-12 w-full rounded-xl border border-white/60 bg-white/50 pl-12 pr-4 outline-none backdrop-blur-xl transition focus:border-cyan-400 focus:bg-white/70"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Profile Image
              </label>

              <label className="flex h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-cyan-400/50 bg-white/40 font-medium text-cyan-700 backdrop-blur-xl transition hover:bg-white/60">
                <ImagePlus size={18} className="mr-2" />
                Upload
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>

          <button className="h-12 w-full rounded-xl bg-linear-to-r from-[#312A2A] via-[#1D1612] to-[#040609] font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer">
            Create Account
          </button>

          <Link href="/login">
            <p className="mt-5 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <span className="cursor-pointer font-semibold text-cyan-700 hover:text-blue-700">
                Login
              </span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
