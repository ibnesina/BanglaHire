"use client";
import Link from "next/link";
import AuthOptions from "./AuthOptions";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

function NavBar() {
  // Define navigation links with their paths and labels
  const navLinks = useMemo(() => [
    { path: "/talent", label: "Hire Talent" },
    { path: "/work", label: "Find Work" },
    { path: "/about", label: "About Us" },
  ], []);

  // Get the current path and determine which link is active
  const pathname = usePathname();
  const activeLink = useMemo(() => {
    return navLinks.find((link) => pathname?.startsWith(link.path));
  }, [pathname, navLinks]);

  return (
    <div className="flex justify-between items-center px-10 py-5 bg-slate-500 text-white sticky top-0 z-50">
      <p className="font-bold text-4xl ">BanglaHire</p>
      <div className="flex gap-5">
        {navLinks.map((link) => (
          <Link href={link.path} key={link.path}>
            <p
              className={`px-4 py-2 rounded-md hover:bg-slate-300 hover:text-zinc-600 hover:font-semibold ${
                activeLink?.path === link.path
                  ? "bg-slate-300 text-zinc-600 font-semibold"
                  : ""
              }`}
            >
              {link.label}
            </p>
          </Link>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="text-black w-94 px-4 py-2 bg-slate-100 border rounded-lg focus:outline-none focus:ring-2 "
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          🔍
        </button>
      </div>
      <AuthOptions />
    </div>
  );
}

export default NavBar;
