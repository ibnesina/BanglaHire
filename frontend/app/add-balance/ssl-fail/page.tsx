"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function SslFailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-20">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100 animate-fadeIn">
          <div className="flex justify-center">
            <XCircle className="w-24 h-24 text-rose-500 mb-6 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">
            Payment Failed
          </h1>
          <div className="h-1 w-20 bg-rose-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 mb-8 text-center leading-relaxed">
            There was an error processing your payment via SSLCOMMERZ. Please
            try again or contact support if the problem persists.
          </p>
          <Link
            href="/add-balance"
            className="block w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition duration-300 ease-in-out transform hover:-translate-y-1 text-center shadow-md"
          >
            Try Again
          </Link>
        </div>
      </main>
    </div>
  );
}
