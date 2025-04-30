"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function SslCancelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <XCircle className="w-20 h-20 text-yellow-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Canceled
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          You canceled the SSLCOMMERZ payment. No changes were made to your
          balance.
        </p>
        <Link
          href="/add-balance"
          className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition"
        >
          Try Again
        </Link>
      </main>
    </div>
  );
}
