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
  ImagePlus,
  Rocket,
  CheckCheckIcon,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function Register() {
  const [location, setLocation] = useState({
    state: "",
    district: "",
    city: "",
    pincode: "",
  });

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

          console.log(data);

          setLocation({
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
          });
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
          <div className="mb-4">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="mt-2 flex items-center gap-2 text-sm font-medium text-cyan-700 hover:text-cyan-900 cursor-pointer"
            >
              <MapPin size={16} />
              Use Current Location
            </button>
          </div>

          {/* Location + Upload */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* State */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                State
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
                />

                <input
                  type="text"
                  placeholder="Enter your state"
                  value={location.state}
                  onChange={(e) =>
                    setLocation({ ...location, state: e.target.value })
                  }
                  className="h-12 w-full rounded-xl border border-white/60 bg-white/50 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/70"
                />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                District
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
                />

                <input
                  type="text"
                  placeholder="Enter your district"
                  value={location.district}
                  onChange={(e) =>
                    setLocation({ ...location, district: e.target.value })
                  }
                  className="h-12 w-full rounded-xl border border-white/60 bg-white/50 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/70"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                City
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
                />

                <input
                  type="text"
                  placeholder="Enter your city"
                  value={location.city}
                  onChange={(e) =>
                    setLocation({ ...location, city: e.target.value })
                  }
                  className="h-12 w-full rounded-xl border border-white/60 bg-white/50 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/70"
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Pincode
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter pincode"
                  value={location.pincode}
                  onChange={(e) =>
                    setLocation({ ...location, pincode: e.target.value })
                  }
                  className="h-12 w-full rounded-xl border border-white/60 bg-white/50 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/70"
                />
              </div>
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
