"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userStore from "@/lib/store";
import { observer } from "mobx-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { logoutAPI } from "@/lib/api/authAPI";

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

  return user ? (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <Avatar>
          <AvatarImage
            src={user.profile_picture || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0].toUpperCase())
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span>{user.name}</span>
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
          <ul>
            <Link href="/profile">
              <li className="hover:bg-gray-100 px-4 py-2">My Profile</li>
            </Link>
            <Link href="/settings">
              <li className="hover:bg-gray-100 px-4 py-2">Settings</li>
            </Link>
            <button
              className="w-full text-left cursor-pointer"
              onClick={async() => {
                await logoutAPI();
              }}
            >
              <li className="hover:bg-gray-100 px-4 py-2">Logout</li>
            </button>
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
