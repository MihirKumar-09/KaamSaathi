import Image from "next/image";
import Link from "next/link";

const workerLinks = [
  { id: 1, name: "Home", href: "/worker/dashboard" },
  { id: 2, name: "Find Jobs", href: "/jobs" },
  { id: 3, name: "Applications", href: "/applications" },
  { id: 4, name: "Saved Jobs", href: "/saved-jobs" },
  { id: 5, name: "Contact Us", href: "/contact" },
];

const employerLinks = [
  { id: 1, name: "Home", href: "/employer/dashboard" },
  { id: 2, name: "Post Job", href: "/post-job" },
  { id: 3, name: "My Jobs", href: "/my-jobs" },
  { id: 4, name: "Applications", href: "/applications" },
  { id: 5, name: "Contact Us", href: "/contact" },
];
export default function NavbarLayout() {
  // Temporary for testing;
  const role = "worker";
  const navLinks = role === "worker" ? workerLinks : employerLinks;
  return (
    <div className="flex items-center justify-between w-full h-20 px-6 lg:px-12 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-md sticky top-0 z-50">
      <Link href={`/${role}/dashboard`}>
        <div>
          <Image
            src="/logo/logo.png"
            alt="KaamSaathi Logo"
            height={80}
            width={80}
          />
        </div>
      </Link>
      <div>
        <ul className="flex gap-12 font-medium ">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className="hover:text-green-600 transition-all duration-300"
            >
              <Link href={link.href}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
