import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
export default function FooterLayout() {
  return (
    <div className="bg-linear-to-r from-[#F8FAFC] via-[#E2E8F0] to-[#CBD5E1] lg:h-72 px-6 lg:px-14">
      <div className="pt-4 lg:pt-6 flex justify-between">
        <div>
          <span>
            <Image
              src="/logo/logo.png"
              alt="KaamSaathi Logo"
              height={60}
              width={60}
            />
          </span>
          <p className="text-sm lg:text-md text-orange-900">
            Find trusted employers and skilled workers for every opportunity.{" "}
            <br className="hidden lg:flex" />
            KaamSaathi makes hiring and job searching simple, secure, and
            reliable.
          </p>
          <div className="flex items-center gap-4 text-xl mt-4 lg:mt-6">
            <span className="cursor-pointer transition-transform duration-300 hover:scale-110">
              <FaFacebook className="text-[#1877F2]" />
            </span>

            <span className="cursor-pointer transition-transform duration-300 hover:scale-110">
              <FaTwitter className="text-[#1DA1F2]" />
            </span>

            <span className="cursor-pointer transition-transform duration-300 hover:scale-110">
              <FaInstagram className="text-[#E4405F]" />
            </span>
          </div>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li>About Us</li>
            <li>Our Mission</li>
            <li>Careers</li>
            <li>Contact Us</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h5>Support</h5>
          <ul>
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Report a Problem</li>
            <li>Safety Tips</li>
            <li>Feedback</li>
          </ul>
        </div>
        <div>
          <h5>Legal</h5>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Cookies Policy</li>
            <li>Community Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
