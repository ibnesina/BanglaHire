"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logoutAPI } from "@/lib/api/authAPI";
import userStore from "@/lib/store";
import { observer } from "mobx-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const AuthOptions = observer(() => {
  const { user } = userStore;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownOptions = [
    { label: "My Profile", href: "/profile" },
    {
      label: "Add Balance",
      href: "/add-balance",
      visibility: user?.type === "Client",
    },
    { label: "Settings", href: "/settings" },
  ];

  // Filter dropdown options based on visibility
  const filteredDropdownOptions = dropdownOptions.filter(
    option => option.visibility === undefined || option.visibility === true
  );
  
  return user ? (
    <div className="relative" ref={dropdownRef}>
      {/* Replace clickable div with a native button */}
      <button
        type="button"
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar>
          <AvatarImage
            src={user.profile_picture ?? "https://github.com/shadcn.png"}
          />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0].toUpperCase())
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span>{user.name}</span>
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10"
          role="menu"
          aria-label="User menu"
        >
          <ul>
            {filteredDropdownOptions.map((option, id) => (
              <li key={id}>
                <Link href={option.href} legacyBehavior>
                  <a
                    className="block hover:bg-gray-100 px-4 py-2"
                    role="menuitem"
                  >
                    {option.label}
                  </a>
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="w-full text-left block hover:bg-gray-100 px-4 py-2"
                onClick={async () => {
                  await logoutAPI();
                }}
                role="menuitem"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href="/signin">
        <Button
          variant="outline"
          className="px-5 text-black cursor-pointer hover:bg-slate-300 hover:text-zinc-600 hover:font-semibold"
        >
          Sign In
        </Button>
      </Link>

      <Link href="/signup">
        <Button
          variant="outline"
          className="px-5 text-black cursor-pointer hover:bg-slate-300 hover:text-zinc-600 hover:font-semibold"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  );
});

export default AuthOptions;
