"use client";

import { passwordChangeSchema, TPasswordChangeSchema } from "@/contracts/users";
import { passwordChangeAPI } from "@/lib/api/authAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TPasswordChangeSchema>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      token: decodeURIComponent(token),
      email: decodeURIComponent(email),
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: TPasswordChangeSchema) => {
    setLoading(true);
    try {
      await passwordChangeAPI(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputFieldDesign =
    "block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40";

  return (
    <div className="w-full h-screen flex justify-center bg-red-100 py-40">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gradient-to-r from-red-200 to-red-300">
      
      <div className="text-5xl font-bold text-white mb-6">
        <span className="text-teal-400">B</span>angla<span className="text-teal-400">H</span>ire
      </div>

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
              disabled
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
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "opacity-50 cursor-not-allowed" : ""
              } inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:ring ring-offset-2 ring-blue-500 active:bg-blue-600 transition ease-in-out duration-150`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Set Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
