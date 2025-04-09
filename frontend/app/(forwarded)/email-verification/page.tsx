"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "";
  const [counter, setCounter] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/signin");
    }
  }, [counter, router]);

  return (
    <div className="w-full h-60 flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg rounded-lg p-6">
      <div className="text-5xl font-extrabold text-white mb-4 tracking-wide">
        <span className="text-yellow-400">B</span>angla
        <span className="text-yellow-400">H</span>ire
      </div>
      <p className="text-white text-lg mb-2">{decodeURIComponent(message)}</p>
      <p className="text-white text-sm italic">
        You will be redirected to the sign in page in {counter} seconds. Enjoy exploring
        BanglaHire!
      </p>
    </div>
  );
}

