"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const CONFETTI_COUNT = 50;
const CONFETTI_COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

export default function GorgeousSuccess() {
  useEffect(() => {
    // nothing extra needed for pure CSS confetti
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-600 overflow-hidden flex flex-col">
      {/* Confetti pieces */}
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const size = Math.random() * 10 + 6;
        const left = Math.random() * 100;
        const delay = Math.random() * 4;
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

      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/10 z-0"></div>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-24 z-10 relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.8 }}
          className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-xl"
        >
          <div className="bg-green-500 rounded-full p-4 mx-auto w-32 h-32 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-white drop-shadow-lg" />
          </div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-5xl font-extrabold text-white drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-6 text-xl text-white/90 max-w-xl leading-relaxed"
          >
            Your account has been topped up 🎉 Thanks for your payment.
            <span className="block mt-2">You can now enjoy all the premium features!</span>
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="mt-10"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
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

      {/* Confetti keyframes */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti {
          animation: confetti-fall var(--duration, 5s) linear infinite;
          z-index: 1;
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}
