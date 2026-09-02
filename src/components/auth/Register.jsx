"use client";
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
  Rocket,
  CheckCheckIcon,
  Heart,
  Eye,
  EyeOff,
  AlertCircle,
  Briefcase,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { registration } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const [forms, setForms] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    role: roleParam === "employer" ? "employer" : "worker",
    location: {
      state: "",
      district: "",
      city: "",
      pincode: "",
      coordinates: {
        latitude: null,
        longitude: null,
      },
    },
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "employer" || r === "worker") {
      setForms((prev) => ({ ...prev, role: r }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setForms((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setForms((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setFetchingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location address");
          }

          const data = await response.json();

          setForms((prev) => ({
            ...prev,
            location: {
              state: data.address?.state || prev.location.state || "",
              district:
                data.address?.state_district ||
                data.address?.county ||
                data.address?.city_district ||
                prev.location.district ||
                "",
              city:
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                prev.location.city ||
                "",
              pincode: data.address?.postcode || prev.location.pincode || "",
              coordinates: {
                latitude,
                longitude,
              },
            },
          }));
        } catch (err) {
          console.error(err);
          setError("Unable to resolve address automatically. Please type it below.");
        } finally {
          setFetchingLocation(false);
        }
      },
      (geoError) => {
        console.error(geoError);
        setFetchingLocation(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError("Location permission denied. Please enter address manually.");
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError("Location information unavailable. Please enter address manually.");
            break;
          case geoError.TIMEOUT:
            setError("Location request timed out. Please enter address manually.");
            break;
          default:
            setError("Could not retrieve current location. Please enter address manually.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!forms.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!forms.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!forms.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    const cleanPhone = forms.phone.trim().replace(/[^0-9]/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError(
        "Please enter a valid 10-digit Indian phone number (starting with 6, 7, 8, or 9).",
      );
      return;
    }
    if (!forms.password) {
      setError("Please create a password.");
      return;
    }
    if (forms.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!forms.gender) {
      setError("Please select your gender.");
      return;
    }
    if (
      !forms.location.state.trim() ||
      !forms.location.district.trim() ||
      !forms.location.city.trim() ||
      !forms.location.pincode.trim()
    ) {
      setError("Please provide complete location details (State, District, City, Pincode).");
      return;
    }
    if (!/^\d{6}$/.test(forms.location.pincode.trim())) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setLoading(true);

      const data = await registration({
        ...forms,
        phone: cleanPhone,
      });

      if (!data || !data.success) {
        setError(data?.message || "Registration failed. Please try again.");
        return;
      }

      const userRole = data.role || data.user?.role || forms.role;
      if (userRole === "worker") {
        router.push("/worker/dashboard");
        router.refresh();
      } else if (userRole === "employer") {
        router.push("/employer/dashboard");
        router.refresh();
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#111827]">
      {/* Left Container */}
      <div className="relative hidden min-h-screen w-[45%] overflow-hidden md:flex">
        {/* Background Image */}
        <Image
          src="/auth/hero.jpeg"
          alt="Hero"
          fill
          sizes="50vw"
          priority
          className="scale-110 object-cover blur-md"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between px-12 py-16 text-white">
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
        {/* Wave Divider */}
        <svg
          className="absolute -right-1 top-0 z-20 h-full w-24 text-[#111827]"
          viewBox="0 0 100 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100,0
       C60,80 90,160 70,240
       C45,320 90,400 70,480
       C50,560 90,640 70,720
       C60,760 80,780 100,800
       L100,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Right Section */}
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[#111827] px-6 py-10 md:w-[55%] md:px-10">
        {/* Glass Card */}
        <div
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[34px]
border border-white/10
bg-linear-to-br from-white/8 via-white/5 to-white/2
shadow-[0_25px_80px_rgba(0,0,0,0.65)]
backdrop-blur-[35px]
before:absolute before:inset-0
before:rounded-[34px]
before:border before:border-white/10
before:bg-linear-to-br
before:from-white/8
before:via-transparent
before:to-white/2
before:pointer-events-none
p-6 sm:p-8"
        >
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Create Account
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Join KaamSaathi today to explore opportunities
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-400 animate-in fade-in duration-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Role Selector */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Registering As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForms((prev) => ({ ...prev, role: "worker" }))
                  }
                  className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    forms.role === "worker"
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400 hover:bg-cyan-500/10"
                  }`}
                >
                  <Briefcase size={16} />
                  Worker (Looking for Work)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForms((prev) => ({ ...prev, role: "employer" }))
                  }
                  className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    forms.role === "employer"
                      ? "border-blue-400 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-blue-400 hover:bg-blue-500/10"
                  }`}
                >
                  <Building2 size={16} />
                  Employer (Hiring Workers)
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/30"
                  name="name"
                  value={forms.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10"
                    name="email"
                    value={forms.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  />

                  <input
                    type="tel"
                    placeholder="10-digit Phone"
                    maxLength={10}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10"
                    name="phone"
                    value={forms.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password (min 6 chars)"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10"
                  name="password"
                  value={forms.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400 cursor-pointer"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Gender */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Gender
              </label>

              <div className="grid grid-cols-3 gap-3">
                {["Male", "Female", "Other"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setError("");
                      setForms((prev) => ({
                        ...prev,
                        gender: item,
                      }));
                    }}
                    className={`h-11 rounded-xl border text-sm font-medium backdrop-blur-xl transition-all duration-300 cursor-pointer ${
                      forms.gender === item
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400 hover:bg-cyan-500/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Location button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={fetchingLocation}
                className="flex cursor-pointer items-center gap-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300 disabled:opacity-50"
              >
                <MapPin size={16} />
                {fetchingLocation ? "Detecting location..." : "Use Current Location"}
              </button>
            </div>

            {/* Address */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* State */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  State
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  />

                  <input
                    type="text"
                    name="state"
                    value={forms.location.state}
                    onChange={handleLocationChange}
                    placeholder="Enter your state"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  District
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  />

                  <input
                    type="text"
                    name="district"
                    value={forms.location.district}
                    onChange={handleLocationChange}
                    placeholder="Enter your district"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  City
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  />

                  <input
                    type="text"
                    name="city"
                    value={forms.location.city}
                    onChange={handleLocationChange}
                    placeholder="Enter your city"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Pincode
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  />

                  <input
                    type="text"
                    name="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    value={forms.location.pincode}
                    onChange={handleLocationChange}
                    placeholder="Enter 6-digit pincode"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10"
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-linear-to-r from-cyan-500 via-blue-600 to-violet-600 font-semibold text-white transition-all duration-300 hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <Link href="/login">
              <p className="mt-5 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <span className="font-semibold text-cyan-400 hover:text-cyan-300">
                  Login
                </span>
              </p>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
