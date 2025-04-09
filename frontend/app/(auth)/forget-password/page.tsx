"use client";
import { forgotPasswordAPI } from "@/lib/api/authAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const fpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});
type TpfSchema = z.infer<typeof fpSchema>;

export default function ForgetPassword() {
  const [forgetPassLoading, setForgetPassLoading] = useState(false);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<TpfSchema>({
    resolver: zodResolver(fpSchema),
    defaultValues: {
      email: "",
    },
});
// await forgotPasswordAPI(email);

  const onForgotPassword = async (data:TpfSchema) => {
    setForgetPassLoading(true); 
    try {
      await forgotPasswordAPI(data.email);
    } finally {
      setForgetPassLoading(false);
    }
  };
  return <div className="flex flex-col items-center justify-center h-screen">
    <form onSubmit={handleSubmit(onForgotPassword)} className="space-y-4">
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
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full mt-4 px-4 py-2 text-white bg-blue-500 rounded-md focus:bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={forgetPassLoading}
      >
        {forgetPassLoading ? "Loading..." : "Send reset link"}
      </button>
    </form>
    
  </div>;
}
