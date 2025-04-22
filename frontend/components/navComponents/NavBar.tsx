import Link from "next/link";
import AuthOptions from "./AuthOptions";

function NavBar() {
  return (
    <div className="flex justify-between items-center px-10 py-5 bg-slate-500 text-white sticky top-0 z-50">
      <p className="font-bold text-4xl ">BanglaHire</p>
      <div className="flex gap-5">
        <Link href="/talent">
          <p className="px-4 py-2 hover:bg-slate-300 hover:text-zinc-600 hover:font-semibold rounded-md">
            Hire Talent
          </p>
        </Link>
        <Link href="/work">
          <p className="px-8 py-2 hover:bg-slate-300 hover:text-zinc-600 hover:font-semibold rounded-md">
            Find Work
          </p>
        </Link>
        <Link href="/about">
          <p className="px-4 py-2 hover:bg-slate-300 hover:text-zinc-600 hover:font-semibold rounded-md">
            About Us
          </p>
        </Link>
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
