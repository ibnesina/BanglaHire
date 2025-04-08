"use client";
import { Button } from "@/components/ui/button";
import {
  TUserRegistrationSchema,
  userRegistrationSchema,
} from "@/contracts/users";
import { signupAPI } from "@/lib/api/authAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Signup() {
  const [type, setType] = useState<"Freelancer" | "Client">("Freelancer");
  const [loading, setLoading] = useState(false);
  const inputFieldDesign =
    "block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUserRegistrationSchema>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      type,
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: TUserRegistrationSchema) => {
    setLoading(true);
    try {
      await signupAPI({ ...data, type });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="signup"
      className="h-screen overflow-scroll flex flex-col items-center justify-center bg-gradient-to-r from-sky-500 to-sky-700"
    >
      <div className="text-5xl font-bold text-white mb-6">
        <span className="text-teal-400">B</span>angla
        <span className="text-teal-400">H</span>ire
      </div>

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Sign up
        </h2>
        <div className="flex justify-center mb-4">
          {["Freelancer", "Client"].map((option) => (
            <button
              key={option}
              onClick={() => setType(option as "Freelancer" | "Client")}
              className={`px-4 py-2 mx-2 font-semibold rounded-md shadow-sm cursor-pointer ${
                type === option
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={`${inputFieldDesign} ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
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
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="password-confirmation"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password-confirmation"
              {...register("password_confirmation")}
              className={`${inputFieldDesign} ${
                errors.password_confirmation ? "border-red-500" : ""
              }`}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`${loading ? "opacity-50 cursor-not-allowed" : ""} w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white cursor-pointer`}
            
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?
            <Link href="/signin">
              <p className="text-blue-500 hover:underline">Sign in</p>
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

