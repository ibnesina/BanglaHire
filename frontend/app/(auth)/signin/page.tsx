"use client";
import { TUserSignInSchema, userSignInSchema } from "@/contracts/users";
import { signInAPI } from "@/lib/api/authAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUserSignInSchema>({
    resolver: zodResolver(userSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TUserSignInSchema) => {
    setLoading(true);
    try {
      await signInAPI(data);
    } finally {
      setLoading(false);
    }
  };

  const inputFieldDesign =
    "block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40";

  return (
    <div>
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-sky-500 to-sky-700"
      >
        <div className="text-5xl font-bold text-white mb-6">
          <span className="text-teal-400">B</span>angla<span className="text-teal-400">H</span>ire
        </div>

        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
            Sign in
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`${inputFieldDesign} ${
                  errors.email ? "border-red-500" : ""
                }`}
                autoFocus
                autoComplete=""
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className={`${inputFieldDesign} ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className={`${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:ring ring-offset-2 ring-blue-500 active:bg-blue-600 transition ease-in-out duration-150`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="text-blue-600 hover:text-blue-700"
                    href="/signup"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </form>
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                router.push("/forget-password");
              }}
              className="text-blue-600 hover:text-blue-800 hover:border-blue-100 rounded-lg px-3 cursor-pointer border-2 border-transparent"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
