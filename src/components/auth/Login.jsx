"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }

      if (data.role === "worker") {
        router.push("/worker/dashboard");
      } else {
        router.push("/employer/dashboard");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex h-screen w-screen flex-col overflow-y-auto bg-slate-950 lg:flex-row lg:overflow-hidden">
      {/* LEFT SIDE */}
      <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 px-6 py-10 sm:px-10 lg:min-h-screen lg:w-[45%] lg:px-16">
        <div className="relative z-10 w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Login to continue your journey with KaamSaathi.
          </p>

          {/* Login Card */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8"
          >
            {/* Email */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none transition duration-300 focus:border-fuchsia-400/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-7">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 outline-none transition duration-300 focus:border-fuchsia-400/60 focus:bg-white/10 focus:ring-2 focus:ring-fuchsia-500/30"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-fuchsia-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-fuchsia-500/40 active:scale-[0.98] cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-fuchsia-400 transition hover:text-fuchsia-300"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden h-screen overflow-hidden lg:block lg:w-[55%]">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop"
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/70 via-fuchsia-900/50 to-slate-950/80" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

        {/* Glow */}
        <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-24 left-10 h-80 w-80 rounded-full bg-indigo-400/20 blur-[120px]" />

        {/* Wave */}
        <svg
          className="absolute -left-1 top-0 h-full w-24 text-slate-950"
          viewBox="0 0 100 800"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0
               C40,80 10,160 30,240
               C55,320 10,400 30,480
               C50,560 10,640 30,720
               C40,760 20,780 0,800
               L0,0 Z"
            fill="currentColor"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex justify-end">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
              Welcome to KaamSaathi
            </span>
          </div>

          <div className="max-w-lg">
            <h2 className="text-5xl font-bold leading-tight tracking-tight text-white">
              Find your next
              <br />
              opportunity.
            </h2>

            <p className="mt-5 text-lg text-white/80">
              Connect with trusted employers, discover better jobs, and grow
              your career with confidence.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "10K+", label: "Jobs" },
              { value: "5K+", label: "Companies" },
              { value: "50K+", label: "Users" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                <p className="text-2xl font-bold text-white">{item.value}</p>

                <p className="mt-1 text-xs text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
