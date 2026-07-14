import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedin, FaHeart } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function FooterLayout() {
  return (
    <footer className="bg-linear-to-r from-[#F8FAFC] via-[#E2E8F0] to-[#CBD5E1]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-14">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div>
            <Image
              src="/logo/logo.png"
              alt="KaamSaathi Logo"
              width={65}
              height={65}
            />

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
              Find trusted employers and skilled workers for every opportunity.
              KaamSaathi makes hiring and job searching simple, secure and
              reliable.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <FaFacebook className="text-lg text-[#1877F2]" />
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <FaInstagram className="text-lg text-[#E4405F]" />
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <FaXTwitter className="text-lg text-slate-900" />
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <FaLinkedin className="text-lg text-[#0A66C2]" />
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Company</h3>
            <div className="mt-2 mb-5 h-0.5 w-14 rounded-full bg-orange-500"></div>

            <ul className="space-y-3 text-slate-600">
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                About Us
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Our Mission
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Careers
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Contact Us
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Blog
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Support</h3>
            <div className="mt-2 mb-5 h-0.5 w-14 rounded-full bg-orange-500"></div>

            <ul className="space-y-3 text-slate-600">
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Help Center
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                FAQs
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Report a Problem
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Safety Tips
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Feedback
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Legal</h3>
            <div className="mt-2 mb-5 h-0.5 w-14 rounded-full bg-orange-500"></div>

            <ul className="space-y-3 text-slate-600">
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Privacy Policy
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Terms & Conditions
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Cookies Policy
              </li>
              <li className="cursor-pointer transition-all duration-300 hover:translate-x-2 hover:text-orange-500">
                Community Guidelines
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-slate-300"></div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-600 md:flex-row">
          <p>© 2026 KaamSaathi. All Rights Reserved.</p>

          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-orange-500">
              Privacy
            </span>
            <span className="cursor-pointer hover:text-orange-500">Terms</span>
            <span className="cursor-pointer hover:text-orange-500">
              Cookies
            </span>
          </div>

          <p className="flex items-center gap-2">
            Made with <FaHeart className="text-red-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
