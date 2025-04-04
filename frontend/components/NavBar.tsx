import Link from "next/link";
import { Button } from "./ui/button";

function NavBar() {
  return (
    <div className="flex justify-between items-center px-10 py-5 bg-slate-500 text-white sticky top-0 z-50">
      <p className="font-bold text-4xl ">BanglaHire</p>
      <div className="flex gap-5">
        <a href="#">
          <p className="px-4 border hover:bg-slate-300 hover:text-zinc-600 hover:font-semibold">
            Hire Talent
          </p>
        </a>
        <a href="#">
          <p className="px-8 border hover:bg-slate-300 hover:text-zinc-600 hover:font-semibold">
            Find Work
          </p>
        </a>
        <a href="#">
          <p className="px-4 border hover:bg-slate-300 hover:text-zinc-600 hover:font-semibold">
            About Us
          </p>
        </a>
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
    </div>
  );
}

export default NavBar;
