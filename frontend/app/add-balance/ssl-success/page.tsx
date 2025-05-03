"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const CONFETTI_COUNT = 30;
const CONFETTI_COLORS = ["#F59E0B","#10B981","#3B82F6","#EF4444","#8B5CF6"];

export default function SslSuccessPage() {
  // no extra logic needed here
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-600 overflow-hidden flex flex-col">
      {/* Subtle radial overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/10 z-0"></div>

      {/* Confetti */}
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const size = Math.random() * 10 + 8;
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 2 + 4;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const shape = i % 3; // 0: rectangle, 1: circle, 2: triangle
        
        return (
          <div
            key={i}
            style={{
              backgroundColor: shape !== 2 ? color : 'transparent',
              borderLeft: shape === 2 ? `${size/2}px solid transparent` : 'none',
              borderRight: shape === 2 ? `${size/2}px solid transparent` : 'none',
              borderBottom: shape === 2 ? `${size}px solid ${color}` : 'none',
              width: shape !== 2 ? `${size}px` : '0px',
              height: shape === 1 ? `${size}px` : shape === 0 ? `${size * 0.4}px` : '0px',
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              borderRadius: shape === 1 ? '50%' : '0',
            }}
            className="confetti absolute top-0 opacity-90 z-0"
          />
        );
      })}

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-24 z-10 relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.8 }}
          className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-md w-full"
        >
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-4 mx-auto w-28 h-28 flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="w-16 h-16 text-white drop-shadow-lg" />
          </div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 text-4xl font-extrabold text-white drop-shadow-md bg-clip-text bg-gradient-to-r from-white to-blue-100"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-4 text-lg text-white/90 max-w-xl"
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
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
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
        </motion.div>
      </main>

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
