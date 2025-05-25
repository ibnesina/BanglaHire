"use client";
import Link from "next/link";
import AuthOptions from "./AuthOptions";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import userStore from "@/lib/store";
import { observer } from "mobx-react-lite";

const NavBar = observer(() => {
  const { user } = userStore;
  // Define navigation links with their paths and labels
  const navLinks = useMemo(() => [
    { path: "/", label: "Home", visibility: true },
    { path: "/talent", label: "Hire Talent", visibility: user?.type === "Client" },
    { path: "/work", label: "Find Work", visibility: user?.type === "Freelancer" },
    { path: "/about", label: "About Us", visibility: true },
    { path: "/chat", label: "Chat", visibility: user?.type === "Client" || user?.type === "Freelancer" },
  ], [user?.type]);


  

  // Get the current path and determine which link is active
  const pathname = usePathname();
  const activeLink = useMemo(() => {
    if (pathname === "/") {
      return navLinks.find((link) => link.path === "/");
    } else {
      return navLinks.find((link) => 
        link.path !== "/" && pathname?.startsWith(link.path)
      ) || navLinks.find((link) => link.path === "/");
    }
  }, [pathname, navLinks]);


  // Redirect if user tries to access unauthorized routes
  const filteredLinks = useMemo(() => 
    navLinks.filter(link => 
      link.visibility === true
    ), [navLinks]);

  // Redirect logic for unauthorized access
  useEffect(() => {
    if (user?.type === "Client" && pathname?.startsWith("/work")) {
      window.location.href = "/";
    } else if (user?.type === "Freelancer" && pathname?.startsWith("/talent")) {
      window.location.href = "/";
    }
  }, [pathname, user?.type]);
  return (
    <div className="flex justify-between items-center px-10 py-5 bg-slate-500 text-white sticky top-0 z-50">
      <Link href="/" className="font-bold text-4xl cursor-pointer">BanglaHire</Link>
      <div className="flex gap-5">
        {filteredLinks.map((link) => (
          <Link href={link.path} key={link.path} className="cursor-pointer">
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
});
export default NavBar;
