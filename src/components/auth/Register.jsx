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
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Register() {
  const router = useRouter();
  const [forms, setForms] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    location: {
      state: "",
      district: "",
      city: "",
      pincode: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForms((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleLocationChange = (e) => {
    const { name, value } = e.target;

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
      alert("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location");
          }

          const data = await response.json();

          console.log(Object.keys(data.address));

          setForms((prev) => ({
            ...prev,
            location: {
              state: data.address.state || "",
              district:
                data.address.state_district ||
                data.address.county ||
                data.address.city_district ||
                "",
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
              pincode: data.address.postcode || "",
            },
          }));
        } catch (error) {
          console.error(error);
          alert("Unable to fetch address.");
        }
      },
      (error) => {
        console.error(error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied.");
            break;

          case error.POSITION_UNAVAILABLE:
            alert("Location unavailable.");
            break;

          case error.TIMEOUT:
            alert("Location request timed out.");
            break;

          default:
            alert("Something went wrong.");
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
    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forms),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      alert(data.message);
      router.push("/");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#111827] px-10 md:w-[55%]">
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
p-8"
        >
          <form onSubmit={handleSubmit}>
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
            <div className="mb-4 grid grid-cols-2 gap-4">
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
                    type="text"
                    placeholder="Phone"
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
                  placeholder="Create password"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10"
                  name="password"
                  value={forms.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
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
                    onClick={() =>
                      setForms((prev) => ({
                        ...prev,
                        gender: item,
                      }))
                    }
                    className={`h-12 rounded-xl border backdrop-blur-xl transition-all duration-300 ${
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

            {/* Current Location */}
            <div className="mb-4">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex cursor-pointer items-center gap-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                <MapPin size={16} />
                Use Current Location
              </button>
            </div>

            {/* Address */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    placeholder="Enter pincode"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/10"
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-linear-to-r from-cyan-500 via-blue-600 to-violet-600 font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
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
