"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/navComponents/NavBar";
import Footer from "@/components/Footer";

const CONFETTI_COUNT = 30;
const CONFETTI_COLORS = ["#F59E0B","#10B981","#3B82F6","#EF4444","#8B5CF6"];

export default function SslSuccessPage() {
  // no extra logic needed here
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-600 to-blue-500 overflow-hidden flex flex-col">
      <NavBar />

      {/* Confetti */}
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const size = Math.random() * 8 + 8;
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        return (
          <div
            key={i}
            style={{
              backgroundColor: color,
              width: `${size}px`,
              height: `${size * 0.4}px`,
              left: `${left}%`,
              animationDelay: `${delay}s`,
            }}
            className="confetti absolute top-0 rounded-sm opacity-90"
          />
        );
      })}

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-24">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.8 }}
        >
          <CheckCircle2 className="w-28 h-28 text-white drop-shadow-lg" />
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 text-5xl font-extrabold text-white drop-shadow-md"
        >
          Payment Successful!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-4 text-lg text-indigo-100 max-w-xl"
        >
          Your account has been topped up via SSLCOMMERZ 🎉  
          Enjoy your new balance and thank you for using our service!
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-white text-indigo-700 px-6 py-3 rounded-full font-medium shadow hover:bg-indigo-50 transition"
          >
            <span>Go to Homepage</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        .confetti {
          animation: confetti-fall 5s linear infinite;
        }
      `}</style>
    </div>
  );
}
