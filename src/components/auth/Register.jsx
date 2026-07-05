"use client";

import Image from "next/image";
import { User, Mail, Lock, Phone, MapPin, Upload } from "lucide-react";

export default function Register() {
  return (
    <main className="min-h-screen bg-[#eef5f7] flex items-center justify-center p-6">
      <div className="w-full max-w-7xl h-[90vh] bg-white rounded-[35px] overflow-hidden shadow-2xl grid lg:grid-cols-2">
        {/* LEFT SIDE */}

        <div className="flex items-center justify-center px-10 py-10 relative bg-white">
          <div className="w-full max-w-md">
            <h1 className="text-5xl font-extrabold text-[#17325c] mb-10 tracking-wide">
              SIGN UP
            </h1>

            {/* Name */}

            <div className="relative mb-5">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"
              />

              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-full bg-cyan-100 py-3 pl-12 pr-5 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Email */}

            <div className="relative mb-5">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-full bg-cyan-100 py-3 pl-12 pr-5 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Password */}

            <div className="relative mb-5">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-full bg-cyan-100 py-3 pl-12 pr-5 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Phone */}

            <div className="relative mb-5">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full rounded-full bg-cyan-100 py-3 pl-12 pr-5 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Location */}

            <div className="relative mb-5">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"
              />

              <input
                type="text"
                placeholder="Location"
                className="w-full rounded-full bg-cyan-100 py-3 pl-12 pr-5 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Profile Image */}

            <label className="flex items-center gap-3 rounded-full bg-cyan-100 px-5 py-3 cursor-pointer hover:bg-cyan-200 transition mb-6">
              <Upload size={18} className="text-cyan-600" />

              <span className="text-gray-500">Upload Profile Image</span>

              <input type="file" className="hidden" />
            </label>

            {/* Checkbox */}

            <div className="flex items-center gap-3 mb-8">
              <input type="checkbox" className="accent-cyan-500 w-4 h-4" />

              <p className="text-sm text-gray-500">
                I agree to all Terms & Conditions
              </p>
            </div>

            {/* Button */}

            <button className="w-full rounded-full bg-cyan-500 text-white py-4 font-bold tracking-wide hover:bg-cyan-600 transition duration-300 shadow-lg">
              CREATE ACCOUNT
            </button>

            <p className="text-center mt-8 text-gray-500">
              Already have an account?
              <span className="text-cyan-600 font-semibold cursor-pointer ml-2">
                Login
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="relative hidden lg:block overflow-hidden">
          <Image
            src="/images/register-bg.jpg"
            alt="Register"
            fill
            className="object-cover"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/30"></div>

          {/* Bottom Text */}

          <div className="absolute bottom-14 left-14 text-white">
            <h2 className="text-5xl font-black tracking-wider uppercase">
              Join Our
            </h2>

            <h3 className="text-6xl font-extrabold">Community</h3>

            <p className="mt-5 text-xl text-white/90 max-w-sm">
              Discover opportunities, connect with people and build your
              professional journey.
            </p>
          </div>

          {/* Floating Button */}

          <div className="absolute right-8 bottom-8 w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}
