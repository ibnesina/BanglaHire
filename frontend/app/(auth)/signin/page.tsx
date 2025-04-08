"use client";
import { TUserSignInSchema, userSignInSchema } from "@/contracts/users";
import { forgotPasswordAPI, signInAPI } from "@/lib/api/authAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

export default function Signin() {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<TUserSignInSchema>({
    resolver: zodResolver(userSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TUserSignInSchema) => {
    await signInAPI(data);
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
          <span className="text-teal-400">B</span>angla
          <span className="text-teal-400">H</span>ire
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
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:ring ring-offset-2 ring-blue-500 active:bg-blue-600 transition ease-in-out duration-150"
              >
                Sign in
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
            <div className="flex items-center justify-center">
              <p
                onClick={async (e) => {
                  e.preventDefault();
                  const email = getValues("email");
                  try {
                    z.string()
                      .email()
                      .nonempty("Must be a valid email")
                      .parse(email);
                  } catch (error) {
                    setError("email", { message: error.message });
                  }
                  await forgotPasswordAPI(email);
                }}
                className="text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Forgot password?
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
